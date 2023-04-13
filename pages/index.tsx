import {
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Fetcher } from "@/helper/axios";
import { useFormik } from "formik";

type Student = {
  id: number;
  name: string;
  email?: string;
  is_coming?: boolean;
  has_submit: boolean;
  phone_number?: number;
};

type PostFormPayload = {
  participantId: number
  isComing: boolean
  email: string
  phoneNumber: number
}

export default function Home() {
  const [selectedName, setSelectedName] = useState<string>("");
  const [listStudent, setListStudent] = useState<Array<string>>([]);
  const [isAvailable, setIsAvailable] = useState(0);

  function postFormData(data: { email: any; phoneNumber: any; available: any; }) {
    try {
      const payload: PostFormPayload = {
        email: data.email || "",
        phoneNumber: Number(data.phoneNumber),
        isComing: Boolean(data.available),
        participantId: Number(selectedName.split("-")[0])
      }
      Fetcher.post("/form", payload).then(res => {
        console.log(res)
        formik.resetForm()
      })
    } catch(err) {
      console.log(err)
    }
  }
  function getFormData() {
    Fetcher.get("/form-content").then((res) => {
      const list = res.data.map((std: { name: any; id: any }, idx: number) => {
        return std.id + "-" + std.name
      })
      setListStudent(list);
    });
  }

  useEffect(() => {
    getFormData();
  }, []);

  const formik = useFormik({
    initialValues: {
      available: 0,
      email: "",
      phoneNumber: "",
    },
    onSubmit: (res) => postFormData(res),
  });

  return (
    <div className="bg-accent flex-column flex-auto h-screen p-4 space-y-4">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <h3>Tell us about you</h3>
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
              id="available"
              name="available"
              label="Available?"
              value={formik.values.available}
            >
              <MenuItem value={1}>Yes</MenuItem>
              <MenuItem value={0}>No</MenuItem>
            </Select>
          </FormControl>
        </div>

        <h3>Tell us how to reach you</h3>
        <div>
          <FormControl fullWidth className="space-y-4">
            <TextField label="Email" name="email" value={formik.values.email} onChange={formik.handleChange}/>
            <TextField label="Phone Number" name="phoneNumber" value={formik.values.phoneNumber} onChange={formik.handleChange}/>
          </FormControl>
        </div>

        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}
