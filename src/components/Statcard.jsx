import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Reports() {

 return (
  <div className="flex">

   <Sidebar />

   <div className="flex-1 bg-slate-100">

    <Navbar />

    <div className="p-8">

      <h1 className="
      text-3xl
      font-bold
      mb-8
      ">
       Reports
      </h1>

      <div className="
      grid
      grid-cols-3
      gap-6
      ">

       <ReportCard
        title="Revenue"
        value="₹15L"
       />

       <ReportCard
        title="Leads"
        value="1250"
       />

       <ReportCard
        title="Conversion"
        value="67%"
       />

      </div>

    </div>

   </div>

  </div>
 );
}

function ReportCard({title,value}){

 return(
  <div className="
   bg-white
   p-8
   rounded-3xl
   shadow-lg
  ">

   <h3>{title}</h3>

   <h2 className="
    text-4xl
    font-bold
    text-violet-600
   ">
    {value}
   </h2>

  </div>
 );
}