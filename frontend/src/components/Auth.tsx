
import {Link, useNavigate } from "react-router-dom";
import  { ChangeEvent,  useState } from 'react'
import axios from 'axios'
import { BACKEND_URL } from "../config"; 
import { SigninInput,SignupInput } from "@kraphe/common";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth =  ({ type }: { type: "signup" | "signin" })=>{

    const navigate = useNavigate();
    
    const [postInputs, setPostInputs] = useState<SigninInput | SignupInput>(
        type === "signup"
            ? { name: "", email: "", password: "" } // SignupInput
            : { email: "", password: "" }           // SigninInput
    );

        async function sendRequest(){
            try {
                const response = await axios.post(`${BACKEND_URL}/api/v1/user/${type}`, postInputs);
                const  data = response.data;
                console.log(data);
                localStorage.setItem( "token", data.jwt);
                navigate("/blogs")
            }catch(err  ){
                //@ts-ignore
                // console.log(err.response.data.error);
                toast.error(err.response.data.error);
            }
        }

    return (
        
        <div className='h-screen flex justify-center flex-col'>
            <div className="flex justify-center">
            {/* {JSON.stringify(postInputs)} */}
            <div>
                <div>
                    <div className='text-3xl font-extrabold ml-16'>
                        Create an account
                    </div>
                    <div className='text-slate-500 ml-16'>
                        {type === "signin" ? "Don't have an account?" : "Already have an account"}
                        <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>{type === "signin" ? "Sign up" : "Sign in"}</Link>
                    </div>
                </div>
                    { 
                            type==="signup"?
                                <LabelledInput label="Userame" placeholder='John Doe' onChange={(e)=>{setPostInputs({
                                    ...postInputs,
                                    // name: e.target.value
                            })}}/>
                            : ''
                    }
                    <   LabelledInput label="Email" type="email" placeholder='jon@gmail.com' onChange={(e)=>{setPostInputs({
                                    ...postInputs,
                                    email: e.target.value
                    })}}/>
                    
                        <LabelledInput label="Password" type={"password"} placeholder='Min 8 character' onChange={(e)=>{setPostInputs({
                                    ...postInputs,
                                    password: e.target.value
                    })}}/>
                    <button  onClick={sendRequest} type="button" className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">{type === "signup" ? "Sign up" : "Sign in"}</button>
                </div>

            </div>
            <ToastContainer />  
        </div>
    )
}


interface LabelledInputType{

    label : string;
    placeholder: string;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    type? : string

}

function LabelledInput({label, placeholder, onChange, type}: LabelledInputType){
    return <div>
         <div>
            <label className="block mb-2 text-sm w-[400px] font-medium text-gray-900 pt-2 dark:text-white">{label}</label>
            <input onChange={onChange} type={type || "text"} id="first_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={placeholder} required />
        </div>
    </div>
}

export default Auth