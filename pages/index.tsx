import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Autocomplete,
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CreditCard } from "@mui/icons-material";
import { ChangeEvent, useEffect, useState } from "react";
import { Fetcher } from "@/helper/axios";
import { useFormik } from "formik";
import { boolean, number, object, string } from "yup";
import { PaymentMethods } from "@/constant/paymentMethod";
import { uploadManager } from "@/helper/imageUpload";
import Image from "next/image";

type Student = {
  id: number;
  name: string;
  email?: string;
  is_coming?: boolean;
  has_submit: boolean;
  phone_number?: number;
};

type PostFormPayload = {
  participantId: number;
  isComing: boolean;
  email: string;
  phoneNumber: string;
  paymentPicUrl: string;
  paymentMethod: string;
};

export default function Home() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [listStudent, setListStudent] = useState<Array<string>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openSnack, setOpenSnack] = useState<boolean>(false);
  const [openSuccess, setOpenSuccess] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  function postFormData(data: {
    email: any;
    phoneNumber: any;
    available: any;
    paymentMethod: string;
  }) {
    console.log(data);
    if (!selectedName) {
      return;
    }
    try {
      setLoading(true);
      const payload: PostFormPayload = {
        email: data.email || "",
        phoneNumber: String(data.phoneNumber),
        isComing: Boolean(data.available),
        participantId: Number(selectedName.split("-")[0]),
        paymentMethod: data.paymentMethod,
        paymentPicUrl: imageUrl,
      };
      Fetcher.post("/form", payload)
        .then((res) => {
          setImageUrl("");
          setSelectedName("");
          formik.resetForm();
          setOpenSnack(true);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }
  function getFormData() {
    Fetcher.get("/form-content").then((res) => {
      const list = res.data.map((std: { name: any; id: any }, idx: number) => {
        return std.id + "-" + std.name;
      });
      setListStudent(list);
    });
  }

  useEffect(() => {
    getFormData();
  }, []);

  const validationSchema = object({
    email: string().email("Enter valid email"),
    phoneNumber: number(),
    available: boolean().required("Please fill your availability"),
    paymentMethod: string().required("Silahkan isi metode pembayaran"),
  });

  const formik = useFormik({
    initialValues: {
      available: 0,
      email: "",
      phoneNumber: "",
      paymentMethod: "",
    },
    onSubmit: (res) => postFormData(res),
    validationSchema: validationSchema,
  });

  const uploadImage = (res: ChangeEvent<HTMLInputElement>) => {
    try {
      setLoading(true);
      if (res.target.files) {
        uploadManager
          .uploadFile(res.target.files[0])
          .then((res) => {
            setLoading(false);
            setImageUrl(res.fileUrl);
            console.log(res);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };
  return (
    <div className="bg-white flex-column flex-auto p-4 space-y-4">
      <h1 className="text-black underline">DivertyOne Bukber Form</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <h3 className="text-black">Kenalan dulu yuk</h3>
          <FormControl fullWidth>
            <Autocomplete
              color="secondary"
              disablePortal
              id="participant"
              options={listStudent}
              value={selectedName}
              onChange={(_, val) => setSelectedName(val || "")}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Name"
                  sx={{ color: "GrayText" }}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Available?</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              onChange={formik.handleChange}
              error={
                formik.touched.available && Boolean(formik.errors.available)
              }
              id="available"
              name="available"
              label="Available?"
              value={formik.values.available}
              defaultValue={null}
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={1}>Pasti Yes</MenuItem>
            </Select>
          </FormControl>
        </div>

        <h3 className="text-black">Tell us how to reach you</h3>
        <div>
          <FormControl fullWidth className="space-y-4">
            <TextField
              label="Email"
              helperText={formik.touched.email && formik.errors.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            <TextField
              label="Phone Number"
              name="phoneNumber"
              type="number"
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
            />
          </FormControl>
        </div>

        <h3 className="text-black">Pembayaran</h3>
        <div className="space-y-4 mb-8">
          <FormControl fullWidth>
            <InputLabel id="payment-method-label">
              Metode Pembayaran?
            </InputLabel>
            <Select
              labelId="payment-method-label"
              onChange={formik.handleChange}
              defaultValue={""}
              error={
                formik.touched.paymentMethod &&
                Boolean(formik.errors.paymentMethod)
              }
              id="paymentMethod"
              name="paymentMethod"
              label="Metode Pembayaran?"
              value={formik.values.paymentMethod}
            >
              {PaymentMethods.map((method) => (
                <MenuItem value={method.method} key={method.method}>
                  {method.method}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <h4 className="text-black">Upload Bukti Pembayaran</h4>
          <Button variant="contained" color="info">
            <Typography className="text-black">Upload</Typography>
          <input hidden accept="image/*" type="file" onChange={uploadImage} />
          </Button>
        </div>
        <div className="space-y-4 mt-4">
          <h3 className="text-black">Informasi</h3>
        <EventDetail />
        <PaymentDetail openSnack={() => setOpenSuccess(true)} />
        </div>

        <Button
          color="primary"
          variant="contained"
          fullWidth
          type="submit"
          className="text-black"
        >
          Submit
        </Button>

        <Dialog open={openSnack} onClose={() => setOpenSnack(false)}>
          <DialogTitle>Data submitted</DialogTitle>
          <DialogContent>
            <p>Thank you, Your registration is now complete.</p>
            <p>Please follow the payment instruction and event guideline</p>
            <p>See you there!</p>
          </DialogContent>
        </Dialog>
        <Backdrop
          sx={{
            color: "#fff",
            zIndex: (theme: any) => theme.zIndex.drawer + 1,
          }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Snackbar
          open={openSuccess}
          autoHideDuration={3000}
          onClose={() => setOpenSuccess(false)}
        >
          <Alert
            onClose={() => setOpenSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Nomer Rekening disalin ke clipboard
          </Alert>
        </Snackbar>
      </form>
    </div>
  );
}

function EventDetail() {
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Informasi Acara</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Image
          src="https://upcdn.io/12a1y8c/raw/uploads/2023/04/png_20230415_135214_0000.png"
          alt="invitation"
          width={240}
          height={360}
        />
        <img

        />
      </AccordionDetails>
    </Accordion>
  );
}

function PaymentDetail({ openSnack }: { openSnack: () => void }) {
  async function copyToCB(number: string) {
    if ('clipboard' in navigator) {
      await navigator.clipboard.writeText(number);
    } else {
      document.execCommand('copy', false, number)
    }
    openSnack(); 
  }
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography>Informasi Pembayaran</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>Ketuk untuk menyalin nomor rekening</Typography>
        <List>
          {PaymentMethods.map((method) => (
            <ListItem key={method.method}>
              <ListItemButton
                onClick={(e) => {
                  copyToCB(method.number);
                }}
              >
                <ListItemIcon>
                  <CreditCard />
                </ListItemIcon>
                <ListItemText
                  primary={`${method.method} an ${method.holder} - ${method.number}`}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
}
