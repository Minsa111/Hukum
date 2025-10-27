import {
  Card,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

interface SectionCardProps {
  title: string;
  fund: number;
}
export function SectionCard({title, fund }:SectionCardProps) {
  return (
    <Card className="flex flex-col justify-center items-center md:items-start m-0 pl-4 pr-8 gap-1 py-2 ">
      <CardTitle className="text-xs text-gray-500 font-medium">
        {title}
      </CardTitle>
      <CardDescription className="text-xs md:text-sm lg:text-md font-semibold text-black">
        Rp. {(fund??0).toLocaleString("id-ID")}
      </CardDescription>
    </Card>
  );
}
