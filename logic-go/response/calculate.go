package response

type DiscountsSubResponse struct {
	Type                  string   `json:"type"`
	Amount                *float64 `json:"amount,omitempty"`
	OriginalDiscountTotal *float64 `json:"originalDiscountTotal,omitempty"`
	CappedAt              *float64 `json:"cappedAt,omitempty"`
}

type Calculate struct {
	FinalPrice       float64                `json:"finalPrice"`
	AppliedDiscounts []DiscountsSubResponse `json:"appliedDiscounts"`
}
