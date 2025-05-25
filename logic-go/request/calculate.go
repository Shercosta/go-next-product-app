package request

type TiersSubRequest struct {
	Min   float64 `json:"min" validate:"required"`
	Max   float64 `json:"max" validate:"required"`
	Value float64 `json:"value" validate:"required"`
}

type DiscountsSubRequest struct {
	Type  string   `json:"type" validate:"required,oneof=fixed percentage conditional tiered cap"`
	Value *float64 `json:"value" validate:"required_if=Type fixed percentage conditional"`

	Condition   *float64 `json:"condition" validate:"required_if=Type conditional"`
	MaxDiscount *float64 `json:"maxDiscount" validate:"required_if=Type cap"`

	Tiers *[]TiersSubRequest `json:"tiers" validate:"required_if=Type tiered"`
}

type CalculateRequest struct {
	OriginalPrice float64               `json:"originalPrice" validate:"required"`
	Discounts     []DiscountsSubRequest `json:"discounts" validate:"required"`
}
