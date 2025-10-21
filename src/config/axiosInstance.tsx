import axios from "axios";
import {apiUrl} from "./env.ts";

export const instance = axios.create({baseURL: apiUrl});
