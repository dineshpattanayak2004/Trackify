import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function Customers() {

 return (
  <div className="main-container">

   <Sidebar />

   <div className="dashboard">

    <Navbar />

    <div className="page-inner">

     <h1 className="page-title">
      Customers
     </h1>

     <div className="card-grid">
      <CustomerCard
       name="Infosys"
       email="info@infosys.com"
      />

      <CustomerCard
       name="TCS"
       email="info@tcs.com"
      />

      <CustomerCard
       name="Wipro"
       email="info@wipro.com"
      />

     </div>

    </div>

   </div>

  </div>
 );
}

function CustomerCard({name,email}){

 return(
  <div className="
   bg-white
   p-6
   rounded-3xl
   shadow-lg

   hover:-translate-y-2
   transition
  ">

   <h2 className="
    text-xl
    font-bold
   ">
    {name}
   </h2>

   <p>{email}</p>

  </div>
 );
}