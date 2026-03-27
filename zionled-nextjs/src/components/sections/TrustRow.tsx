interface TrustRowProps {
  phone?: string
}

export default function TrustRow({ phone }: TrustRowProps) {
  const items = [
    { icon: 'UL', text: 'DLC & UL Certified' },
    { icon: 'WR', text: 'Industry Warranties' },
    { icon: 'RB', text: 'Utility Rebate Eligible' },
    { icon: 'SH', text: 'Fast Nationwide Shipping' },
    { icon: 'CS', text: 'Free Consultation' },
  ]

  return (
    <div className="trust-row">
      <div className="site-shell trust-row-inner">
        {items.map((item) => (
          <div key={item.text} className="trust-row-item">
            <div className="trust-row-icon" aria-hidden="true">
              {item.icon}
            </div>
            <span>{item.text}</span>
          </div>
        ))}

        <div className="trust-row-item trust-row-phone">
          <div className="trust-row-icon" aria-hidden="true">
            PH
          </div>
          <strong>{phone || '(817) 938-2959'}</strong>
        </div>
      </div>
    </div>
  )
}
