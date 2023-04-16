
export type PaymentMethod = {
  method: string
  number: string
  holder: string
}

export const PaymentMethods: PaymentMethod[] = [
  {
    method: "BRI",
    number: "302801042842536",
    holder: "Febiyanti",
  },
  {
    method: "BCA",
    number: "0471546533",
    holder: "Nur Fadila Romadhona",
  },
  {
    method: "MANDIRI",
    number: "1370019758248",
    holder: "Widya Salsabila N",
  },
  {
    method: "DANA",
    number: "085975343039",
    holder: "Febiyanti",
  },
  {
    method: "OVO",
    number: "082328904181",
    holder: "Salsabiila Alya Safitri",
  },
  {
    method: "GOPAY",
    number: "082328904181",
    holder: "Salsabiila Alya Safitri",
  },
  {
    method: "SHOPEEPAY",
    number: "081386180787",
    holder: "Nuralifyamaulidah",
  },
  {
    method: "COD",
    number: "085975343039",
    holder: "SMANSA jam 2 - 3"
  }
]
