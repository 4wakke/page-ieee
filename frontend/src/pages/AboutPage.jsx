// eslint-disable-next-line no-unused-vars
import { useEffect, useState } from "react";

function AboutPage() {

  useEffect(() => {
    document.body.classList.add("about-page");
    return () => {
      document.body.classList.remove("about-page");
    };
  }, []);
  return (
    <div>
      <h1 className="text-3xl- font-bold my-4"> About Us </h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque ex
        fugiat eos reprehenderit nisi amet, tempora tempore, optio hic ipsam,
        magni praesentium dolorum voluptatem? Accusantium atque nihil vel labore
        illo, laboriosam voluptas, distinctio nam nulla sequi eum amet
        doloremque cumque?
      </p>
    </div>
  );
}

export default AboutPage;
