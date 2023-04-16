import { Participant } from "@/constant/types";
import { Fetcher } from "@/helper/axios";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Download } from '@mui/icons-material'
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { saveAs } from 'file-saver'
import Image from "next/image";

function Result() {
	const columns: GridColDef[] = useMemo(() => [
		{ field: "id", headerName: "ID", width: 30 },
		{
			field: "name",
			headerName: "Name",
			maxWidth: 400,
			minWidth: 100,
			width: 200,
		},
		{ field: "has_submit", headerName: "Is coming", maxWidth: 60 },
		{ field: "payment_method", headerName: "Payment Method" },
		{
			field: "payment_image_url",
			headerName: "Bukti Pembayaran",
			renderCell: (e) => (
				<div>
					{e.value && (
						<Button onClick={() => setSelectedImage(e.value)}>
							<Typography>View</Typography>
						</Button>
					)}
				</div>
			),
		},
		{ field: "phone_number", headerName: "Phone Number", width: 150 },
		{ field: "food_option", headerName: "Makanan", width: 150 },
	], []);
	const [selectedImage, setSelectedImage] = useState<string>("")
  const [participants, setParticipants] = useState<Array<Participant>>([]);
  function getParticipants() {
    Fetcher("/participant")
      .then((res) => {
        console.log(res);
        setParticipants(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  useEffect(() => {
    getParticipants();
  }, []);
  return (
    <div className="bg-white h-full min-h-screen p-4 space-y-4">
			<h1 className="text-black">Data Peserta Bukber</h1>
      <DataGrid columns={columns} autoHeight rows={participants} />
			<Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage("")}>
				<DialogTitle>Bukti Pembayaran</DialogTitle>
				<DialogContent>
					<div className="space-y-4">
					<Image
						src={selectedImage}
						alt="bukti_pembayaran"
						width={320}
						height={640}
					/>
					<Button variant="contained" startIcon={<Download/>} onClick={() => { saveAs(selectedImage, `bukti-pembayaran-${Date.now()}`) }}>
						<Typography>Download</Typography>
					</Button>
					</div>
				</DialogContent>
			</Dialog>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Result), { ssr: false });
