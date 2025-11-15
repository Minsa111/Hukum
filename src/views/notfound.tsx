import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { useNavigate} from "react-router-dom"

export default function Page() {
  const navigate = useNavigate();
  return (
    <div
      style={
        {
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="flex flex-col min-h-screen"
    >
      <Navbar/>
      {/* <SiteHeader title="Dashboard" /> */}

      {/* Main Content */}
        <div className="flex flex-1 flex-col gap-2 bg-background justify-center relative lg:px-16 px-2 w-full">
          <div className="@container/main flex flex-1 flex-col justify-center gap-2 ">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="flex flex-col gap-y-4 gap-x-6 items-center mx-0 md:mx-6 lg:mx-6">
                <span className="text-8xl font-black items-center text-red-500"> Error 404 not found</span>
                <Button 
                variant={"secondary"} 
                size={"lg"}
                className="w-32"
                onClick={() => navigate("/")}>Kembali</Button> 
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
