import axios from "axios";

const baseURL = `http://localhost:9000/api`;

export const getAll = async (url: string) => {
  const { data } = await axios.get(`${baseURL}/${url}`);
  return data.items;
};

export const deleteById = async (
  url: string,
  { arg }: { arg: { id: number } }
) => {
  const id = arg.id;
  await axios.delete(`${baseURL}/${url}/${id}`);
};

export const deleteInschrijvingById = async (
  url: string,
  { arg }: { arg: { idLid: number; idAct: number } }
) => {
  const lidId = arg.idLid;
  const actId = arg.idAct;
  await axios.delete(`${baseURL}/${url}/${lidId}/${actId}`);
};

export const save = async (
  url: string,
  { arg }: { arg: { id?: number; body: any } }
) => {
  await axios({
    method: arg.id ? "PUT" : "POST",
    url: `${baseURL}/${url}/${arg.id ?? ""}`,
    data: arg.body,
  });
};
