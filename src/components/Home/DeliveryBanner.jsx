export default function DeliveryBanner() {
  return (
    <div
      className="mx-4 mt-3 mb-5 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #1B5E20, #2E7D32, #388E3C)',
        borderRadius: 14,
        boxShadow: '0 4px 14px rgba(27,94,32,0.18)'
      }}
    >
      <div style={{ padding: '18px 20px' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[9px] bg-red-600 text-white font-bold px-1.5 py-0.5 uppercase tracking-wider">
            Super Value Days
          </span>
          <span className="text-[10px] text-yellow-300 font-medium">Friday - Sunday</span>
        </div>
        <h3 className="text-white text-[18px] font-extrabold leading-tight" style={{ letterSpacing: '-0.3px' }}>
          Mega savings<br />every weekend
        </h3>
        <div className="flex gap-2 mt-3">
          <span className="text-[9px] bg-white/15 text-white px-2 py-1 font-medium">
            Up to 45% on top brands
          </span>
          <span className="text-[9px] bg-white/15 text-white px-2 py-1 font-medium">
            Cashbacks & offers
          </span>
        </div>
      </div>
    </div>
  );
}
