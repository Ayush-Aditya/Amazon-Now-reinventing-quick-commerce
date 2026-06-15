/**
 * 01 — Event Collector  (MOCK / DESIGN ONLY)
 * ---------------------------------------------------------------
 * Responsibility: every confirmed order is captured here as a
 * single immutable OrderEvent and appended to the event log.
 *
 * In production this is the entry point of the entire ML pipeline
 * — every other stage reads from the event log this writes to.
 *
 * Why this is its own stage
 *   - decouples writes from reads (miner runs on a schedule)
 *   - lets us replay history if we change the schema or algorithm
 *   - the same log feeds analytics, churn modelling, etc.
 *
 * Where this would actually live
 *   - HTTP listener:       POST /internal/orders/event   (JWT-signed)
 *   - or a Kinesis source: stream "orders-confirmed"
 *   - or a Kafka topic:    topic "orders.v1"
 *
 * Storage layout (production sketch)
 *   - hot path: DynamoDB partition by `userId`, sort by `timestamp` desc
 *   - cold path: S3 parquet keyed by yyyy/mm/dd/userId for SageMaker jobs
 */

import { randomULID } from './_utils.mock.js';

/**
 * @typedef {Object} OrderItem
 * @property {string} productId
 * @property {number} qty
 * @property {number} [unitPrice]
 *
 * @typedef {Object} OrderContext
 * @property {0|1|2|3|4|5|6} dayOfWeek
 * @property {number} hourLocal
 * @property {'clear'|'rainy'|'cold'|'hot'|'stormy'|'unknown'} weather
 * @property {boolean} isHoliday
 * @property {boolean} isPayday
 * @property {string} deliveryPincode
 *
 * @typedef {Object} OrderEvent
 * @property {string} eventId
 * @property {string} userId
 * @property {string} orderId
 * @property {string} timestamp ISO-8601 UTC
 * @property {OrderItem[]} items
 * @property {OrderContext} context
 * @property {'manual'|'ai-cart'|'preloaded-cart'|'reorder'|'voice'} source
 */


/**
 * Build a normalized OrderEvent from a raw checkout payload.
 *
 * The job here is enrichment + normalisation. By the time the event
 * lands in the log it should be self-contained enough that no other
 * pipeline stage needs to call back to a service.
 *
 * @param {object} rawOrder
 * @returns {OrderEvent}
 */
export function buildEvent(rawOrder) {
  // TODO: real implementation
  //
  // 1. Generate a ULID for eventId. ULIDs are time-sortable, which
  //    means our hot store can be a sorted log without a secondary
  //    index on timestamp.
  //
  // 2. Capture local-time features once at write time. We do NOT
  //    want every miner job to recompute "what weekday was this?"
  //    on millions of rows during backfills.
  //
  // 3. Resolve weather + holiday flags. These come from a short-TTL
  //    cache populated by an upstream job (city × hour grid).
  //
  // 4. Tag `source` from the cart-source label so we can later
  //    discount AI-suggested orders during pattern mining.

  return {
    eventId: randomULID(),
    userId: rawOrder.userId,
    orderId: rawOrder.orderId,
    timestamp: new Date().toISOString(),
    items: rawOrder.items.map(it => ({
      productId: it.productId,
      qty: it.qty,
      unitPrice: it.unitPrice
    })),
    context: {
      dayOfWeek: 0,                  // TODO: derive from local TZ
      hourLocal: 0,                  // TODO
      weather: 'unknown',            // TODO: lookup weather cache
      isHoliday: false,              // TODO: lookup holiday cache
      isPayday: false,               // TODO: simple rule (1st-3rd, last day, salary day)
      deliveryPincode: rawOrder.pincode
    },
    source: rawOrder.source ?? 'manual'
  };
}


/**
 * Persist an event to the event log.
 *
 * Production version is a single write to Kinesis or DynamoDB and
 * returns once durably acked. Idempotent on `eventId`.
 *
 * @param {OrderEvent} event
 * @returns {Promise<void>}
 */
export async function appendToEventLog(event) {
  // TODO:
  //   await dynamo.putItem({
  //     TableName: 'order-events',
  //     Item: marshall(event),
  //     ConditionExpression: 'attribute_not_exists(eventId)'  // idempotency
  //   });
  //
  //   Also fan out to S3 cold storage via Firehose.

  console.log('[mock] event collected', event.eventId);
}


/**
 * Convenience wrapper used by the order-confirmation endpoint.
 */
export async function recordOrder(rawOrder) {
  const event = buildEvent(rawOrder);
  await appendToEventLog(event);
  return event;
}
