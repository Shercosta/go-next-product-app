package response

type DiscountsSubRequest struct {
	Type                  string   `json:"type"`
	Amount                *float64 `json:"amount"`
	OriginalDiscountTotal *float64 `json:"originalDiscountTotal"`
	CappedAt              *float64 `json:"cappedAt"`
}

type Calculate struct {
	FinalPrice       float64               `json:"finalPrice"`
	AppliedDiscounts []DiscountsSubRequest `json:"appliedDiscounts"`
}
