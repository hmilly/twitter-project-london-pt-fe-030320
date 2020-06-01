import API from "./API.js";
import { API_ENDPOINT, counting, makeNewComment, currentDate } from "./api.js";

console.log(
  "The current user is",
  API.whichUser.person,
  "with user id: ",
  API.whichUserId.id,
  "The clicked comment id is :",
  API.clickedCommentId.comid
);

const profilePic = document.querySelector(".img-counter > img");
const title = document.querySelector(".title > h2");
const at = document.querySelector(".at");
const userCont = document.querySelector(".contents > p");

const likeno = document.querySelector(".heart > p");
const shareno = document.querySelector(".share > p");
const messages = document.querySelector(".msgs > p");

const likes = document.querySelector(".heart > img");
const share = document.querySelector(".share > img");

const commentsDiv = document.querySelector(".msg-container");

const showComment = (item) => {
  API.getUsers().then((userData) => {
    for (let i of userData) {
      if (i.id === item.userId) {
        const newcomment = document.createElement("div");
        newcomment.className = "item";
        newcomment.innerHTML = `
                  <div class="head">
                      <img src="${i.avatar_url}" alt="circular picture token">
                      <div class="comments-box">
                          <div>
                              <div>
                                  <p>${i.name}</p>
                                  <p>@${i.name}</p>
                              </div>
                          </div>
                          <span></span>
                      </div>
                  </div>
                  <div class="content">
                      <p>
                          ${item.content}
                      </p>
                  </div>`;
        commentsDiv.append(newcomment);
      }
    }
  });
};

API.getTweets()
  .then((tweetData) => {
    for (let i in tweetData) {
      if (tweetData[i].id == API.clickedCommentId.comid) {
        profilePic.src = `${tweetData[i].user.avatar_url}`;
        title.innerText = `${tweetData[i].user.name}`;
        at.innerText = `@${tweetData[i].user.name}`;
        userCont.innerText = `${tweetData[i].content}`;
        likeno.innerText = `${tweetData[i].likes}`;
        shareno.innerText = `${tweetData[i].retweets}`;
        messages.innerText = `${tweetData[i].comments.length}`;

        tweetData[i].comments.forEach((item) => showComment(item));
      }
    }
  })
  .then(() => {
    const once = { once: true };
    likes.addEventListener(
      "click",
      (e) => {
        const addLikes =
          parseInt(likes.parentElement.querySelector("p").innerText) + 1;
        counting(
          { likes: addLikes },
          `${API_ENDPOINT}/comments/${API.clickedCommentId.comid}`
        );
        likes.parentElement.querySelector("p").innerText = addLikes;
        e.target.src = "./img/icon.png";
      },
      once
    );
  })
  .then(() => {
    const once = { once: true };
    share.addEventListener(
      "click",
      (e) => {
        const addRetweet =
          parseInt(share.parentElement.querySelector("p").innerText) + 1;
        counting(
          { retweets: addRetweet },
          `${API_ENDPOINT}/comments/${API.clickedCommentId.comid}`
        );
        share.parentElement.querySelector("p").innerText = addRetweet;
        e.target.src = "./img/retweet.png";
      },
      once
    );
  })
  .then(() => {
    const coms = document.querySelector(".msgs");
    coms.addEventListener("click", (e) => {
      const combox = document.createElement("div");
      combox.className = "text";
      combox.innerHTML = `
        <textarea name="comment" class="commentText" placeholder="Your comment" rows="5"></textarea>
        <div>
          <img src="./img/Arrow 1.png" alt="arrow" class="arrow"></img>
          <button class="reply">Reply</button>
        </div>`;
      e.target.offsetParent.append(combox);

      coms.disabled = true;
      commentsDiv.style.height = "42%";

      const arrow = combox.querySelector(".arrow");
      arrow.addEventListener("click", () => {
        combox.remove(combox);
        coms.disabled = false;
        commentsDiv.style.height = "60%";
      });

      const reply = combox.querySelector(".reply");
      reply.addEventListener("click", () => {
        const textcont = combox.querySelector(".commentText");
        const pselect = coms.parentNode.querySelector("p");

        if (textcont.value === "") {
          window.alert("Please enter a comment!");
        } else {
          makeNewComment(textcont.value);
          showComment({
            "userId": parseInt(API.whichUserId.id),
            "tweetId": parseInt(API.clickedCommentId.comid),
            "content": textcont.value,
            "date": `${currentDate}`,
            "retweets": 0,
            "likes": 0
          });
          const pselect = coms.parentNode.querySelector("p");
          pselect.innerText = parseInt(pselect.innerText) + 1;
          combox.remove(combox);
          coms.disabled = false;
          commentsDiv.style.height = "60%";
        }
      });
    });
  });
