const p = [
"BRI 302801042842536  a.n Febiyanti",
"BCA 0471546533 a.n Nur Fadila Romadhona",
"MANDIRI 1370019758248 a.n Widya Salsabila N",
"DANA 085975343039 a.n Febiyanti",
"OVO 082328904181 a.n Salsabiila Alya Safitri",
"Gopay 082328904181 a.n Salsabiila Alya Safitri",
"Shopeepay 081386180787 a.n nuralifyamaulidah",
]

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
]
