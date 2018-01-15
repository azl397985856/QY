const fetch = require("isomorphic-fetch");

const webhook = {
  send(results, { webhookUrl }) {
    // 目前使用钉钉机器人：
    // https://open-doc.dingtalk.com/docs/doc.htm?spm=a219a.7629140.0.0.karFPe&treeId=257&articleId=105735&docType=1#s2
    const content = results.map(r => r.content).join("\n");

    console.info("content", content);

    return fetch(webhookUrl, {
      method: "POST",
      body: JSON.stringify({
        msgtype: "text", // 目前只支持text类型
        text: {
          content
        }
        // at: {
        //   atMobiles: ["1xxxxx", "1xxxxx"],
        //   isAtAll: false
        // }
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => console.log("res", res))
      .catch(err => console.log("err", err));
  }
};

export default webhook;
