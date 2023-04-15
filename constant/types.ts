export type Participant = {
    id: number;
    name: string;
    email?: string;
    is_coming?: boolean;
    has_submit: boolean;
    phone_number?: number;
    payment_method?: string;
    payment_image_url?: string;
  };

  export const FoodOption = [
    'Nasi Tuna Mentai + Lychee Yakult',
    'Chicken Katsu Spicy Mayo + Giant Lemon Tea'
  ]