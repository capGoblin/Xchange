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
