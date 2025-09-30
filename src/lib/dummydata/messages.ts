import { Message } from "./index";

export const messages: Message[] = [
  {
    id: 1,
    sender: {
      name: "Alex Bennett",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBtZluTDjoXgyJKtvG4XfNmesWiwhS71_riSpQsUSm1ECorRmk78LKeDCwv0fhTiJ_me4QOfQmlOt2e7zwVqIYy8bJTT7n7Y8ZgfvZ6zWcLSvjHYvOthD04SkAKKc8-4-2k85iLJGatXuKws39GrpJqIPC15dWMSMxrWiEzkIgseOvFbZ80GJ_ZLSz3lvCwoD1Rba1KSYpQLOtE6EWCs9aRnYapSwbmuS1ZYqeTYS3uYZkhtMbQczaFV-PLmS6-s-iXrcm67J8XwDrG",
    },
    time: "10:30 AM",
    content:
      "Hi Sarah, I've reviewed the latest design revisions and they look great. I've also updated the project timeline to reflect the changes. Please let me know if you have any questions.",
    type: "received",
  },
  {
    id: 2,
    sender: {
      name: "Sarah Miller",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDgk5YSp3XlULuRGJzraZmA4z-fXAASvZWFgcogJ94ZbOVDyur8nTkumXM3BLdlzezDg8bBis7S6vkSMpCvDTFS8nASIeHmzfILX42f5cyUynf_qjTm2uB0DMTxXzYoxOjlLg5vOXYVdwKhxFOyxaUlIpkvkSWDHPclvznlseRioFKOk1cEMa6pOndyrJio8YN4RnOQFjJ5ZZox4_aDj3mQ1jy4skSCB_r95Dl24lv6kxLgXNvfHh54-f_QGC6HMPsIrSyCPehlAygi",
    },
    time: "10:32 AM",
    content:
      "Hi Alex, thanks for the update. I have a question about the material selection for the kitchen countertops. Could we discuss some options?",
    type: "sent",
  },
  {
    id: 3,
    sender: {
      name: "Alex Bennett",
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAG6hFQrR4bk0sPN1StW8oAkbrm3mx47V_hnKEq4N-rSkU9cz5qc4sC4mKahMaQU87L5OyHjAZWyg6OcJNU1LWL61gQ1-UyDXGNleH2_sLU4JcF9SjOgpC-Ex8m1AkG-4L9XLxKwgAqTBO63MZvgpkj_etjMQH5TU5_DZwyk3gsRXWDZFwRfhX17j4kU8BT5uanA_Xska9QSTGJFZbX6ggCseo8feS4SLV_FVAiX8347skeb9FGmHAO9vZ540vWfCfduUrUo1miUT5t",
    },
    time: "10:35 AM",
    content:
      "Of course, Sarah. I've attached a document with a few options and their respective costs. Let's schedule a quick call to go over them.",
    type: "received",
    attachment: {
      name: "Countertop Options.pdf",
      size: "1.2 MB",
      preview:
        "https://www.maramani.com/cdn/shop/files/Modernclassical6-bedroommansionhouseplan-ID2670802.jpg?crop=center&height=1200&v=1688375715&width=1200",
    },
  },
];
