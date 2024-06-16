import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Check, Linkedin } from "lucide-react";
import { LightBulbIcon } from "./Icons";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import pilot from "../assets/pilot.png";

export const HeroCards = () => {
  return (
    <div className="">
      {/* Testimonial */}
      <img
        src={pilot}
        alt=""
        className="w-[400px] object-contain rounded-lg"
        style={{
          transform: "rotateY(180deg)",
        }}
      />{" "}
    </div>
  );
};
