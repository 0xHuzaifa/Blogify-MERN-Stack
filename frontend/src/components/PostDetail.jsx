import React from "react";
import { useParams } from "react-router-dom";
import img2 from "../assets/img2.jpg";
export default function PostDetail() {
  // const {id} = useParams()
  return (
    <article className="max-w-full bg-[#EAFAEA]">
      <div className="w-full sm:max-w-[550px] md:max-w-[750px] lg:max-w-[970px] xl:max-w-[1170px] mx-auto px-[15px] py-8 sm:py-10 md:py-13 lg:py-18">
        {/* Title */}
        <div className="pb-10">
          <label
            htmlFor="title"
            className="text-base font-semibold text-[#6E8E59]"
          >
            Title
          </label>
          <h1 className="text-xl sm:text-3xl md:text-5xl text-[#780C28] font-bold">
            Blog Post 1
          </h1>
        </div>

        {/* Image */}
        <div className="aspect-3/2 mx-auto">
          {/* 183 / 275 = 0.6655 */}
          <img
            src={img2}
            alt="Blog post main image"
            className="w-full h-[50%] object-cover object-center rounded-lg"
          />
        </div>

        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati
            vel consectetur eveniet mollitia aut exercitationem aperiam facere,
            magni quidem. Autem aliquam, recusandae eum cum modi aut nisi
            deleniti minus facere distinctio cupiditate sint aspernatur nulla
            soluta optio inventore harum odio rerum voluptates. Voluptatum
            aliquam sed, illo odit rem, expedita eaque laudantium iste rerum
            tempore necessitatibus officiis voluptatem dignissimos unde
            obcaecati! Voluptate atque odio corrupti assumenda aperiam aut
            commodi exercitationem nisi molestiae neque nam sit, earum,
            optionobis incidunt quaerat consequatur eum suscipit? Nam ducimus
            sapiente officiis nisi porro sit dolor incidunt doloremque iure
            error, voluptatibus eaque ratione at sed labore necessitatibus quasi
            omnis architecto cum atque deserunt vitae autem blanditiis dolore?
            Perspiciatis, ratione minus ipsam in possimus necessitatibus
            explicabo soluta provident ducimus quas nisi ad quod. Quas labore
            officia, sed dolorum facilis nostrum voluptas! Excepturi nulla
            ducimus consequuntur, ab doloribus labore error delectus quisquam
            quaerat magnam odit, quidem molestias iure est laboriosam voluptatum
            praesentium modi possimus tenetur animi. Eligendi optio culpa enim
            iusto similique, quis minus placeat ullam ab ex fugit adipisci
            fugiat iure quod nulla ipsum voluptatibus excepturi. Repellendus,
            deserunt quia. Est, a sequi. Placeat numquam quos doloremque nulla
            quis tempora error? Pariatur ipsam voluptatibus iure magnam omnis
            perspiciatis magni quo quis praesentium eius. Repellat amet
            blanditiis asperiores deserunt eligendi perspiciatis voluptatibus,
            distinctio incidunt, assumenda nihil atque excepturi tempore dolore,
            pariatur corrupti perferendis ab maxime nam accusamus dolor? Alias
            consequatur autem at libero, id inventore. Ex doloribus tenetur
            vitae consectetur ipsum odit, recusandae dignissimos laudantium
            mollitia cumque et atque.
          </p>
        </div>
      </div>
    </article>
  );
}
