// seed.js
const { PrismaClient } = require("../src/generated/prisma");
const { hash } = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clear existing data (optional - be careful in production)
  if (process.env.NODE_ENV === "development") {
    console.log("Clearing existing data...");

    // Delete in correct order to respect foreign key constraints
    await prisma.deliveredFile.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.cart.deleteMany();
    await prisma.designDiscount.deleteMany();
    await prisma.discount.deleteMany();
    await prisma.packageOption.deleteMany();
    await prisma.file.deleteMany();
    await prisma.designDocuments.deleteMany();
    await prisma.designView.deleteMany();
    await prisma.review.deleteMany();
    await prisma.design.deleteMany();
    await prisma.folder.deleteMany();
    await prisma.category.deleteMany();
    await prisma.projectFeedback.deleteMany();
    await prisma.projectCost.deleteMany();
    await prisma.projectMilestone.deleteMany();
    await prisma.projectRequirement.deleteMany();
    await prisma.invoiceItem.deleteMany();
    await prisma.invoice.deleteMany();
    await prisma.project.deleteMany();
    await prisma.feedback.deleteMany();
    await prisma.newsletterSubscription.deleteMany();
    await prisma.customDesignRequest.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.loginHistory.deleteMany();
    await prisma.account.deleteMany();
    await prisma.session.deleteMany();
    await prisma.verificationToken.deleteMany();
    await prisma.banner.deleteMany();
    await prisma.marqueeItem.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.post.deleteMany();
    await prisma.referralVisit.deleteMany();
    await prisma.ongoingProject.deleteMany();
    await prisma.monthlyCost.deleteMany();
    await prisma.user.deleteMany();
  }

  // Create Users
  console.log("Creating users...");
  const users = await Promise.all([
    prisma.user.create({
      data: {
        id: "cmhvtt68p0000l104d24gl33z",
        name: "Duncan Juma",
        email: "djuma7425@gmail.com",
        emailVerified: null,
        image:
          "https://lh3.googleusercontent.com/a/ACg8ocKG7f6SOl_TgeryXz4sF1jKbPkdla_3pcMjzpHyqpoi9XfkdCEh=s96-c",
        role: "ADMIN",
        hashedPassword: null,
        status: "ACTIVE",
        phone: "+254794636982",
        referralCode: "cmhvtt68p0001l104zkikvsj7",
        accounts: {
          create: [
            {
              id: "cmhvtt69g0003l104q9o40ege",
              type: "oauth",
              provider: "google",
              providerAccountId: "117335255950880195665",
              refresh_token:
                "1//05vpdtqUuOfD6CgYIARAAGAUSNwF-L9IrIJ_QmT9JLqjZqAdbbepjwxqQU54dL1D-CZ41CpGucUlzabT7AtTlIeqCrdQNvypH8k4",
              access_token:
                "ya29.a0ATi6K2v_YSI3qdplNZIpDrTT4PULFfu8NjrNLSV74qBfL1rOSV_f7kMtJM4QNMoErSM6BaOhYueC2avK4G8QOywRQP0CWL7oPVZDjvrtTXeVTXx8MrSeJBfZGhtOgdu8JHK96cHkHByMlOkL3YuzpObYkyVpPsq7-rK0mRdG80B3Dj9BjrYOIerrfuw3NnDJrJqF_-IaCgYKARUSARASFQHGX2MiIEVvBcdDp6W7LUvAww0wjw0206",
              expires_at: 1762945029,
              token_type: "Bearer",
              scope:
                "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
              id_token:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRmZWI0NGYwZjdhN2UyN2M3YzQwMzM3OWFmZjIwYWY1YzhjZjUyZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTczMzUyNTU5NTA4ODAxOTU2NjUiLCJlbWFpbCI6ImRqdW1hNzQyNUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6ImxQTEJtcEtFV1ZROUpSd3M5WmctZmciLCJuYW1lIjoiRHVuY2FuIEp1bWEiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jS0c3ZjZTT2xfVGdlcnlYejRzRjFqS2JQa2RsYV8zcGNNanpwSHlxcG9pOVhma2RDRWg9czk2LWMiLCJnaXZlbl9uYW1lIjoiRHVuY2FuIiwiZmFtaWx5X25hbWUiOiJKdW1hIiwiaWF0IjoxNzYyOTQxNDMwLCJleHAiOjE3NjI5NDUwMzB9.TVO3asVTNVWIm12n-gADfScr5RKQXgiyKbQF9RdKBFDAXPTlw3aVO-yDJZtE5r5Ie0OYFiNra3bPnY0Z93aXnNVsj2nE4p-9RvLW_bZCARa2vavfSgpphzV7zYSvCv2OZC_MrGXVfFylUUDlos74Xq4VgW96MWChfzElZob5qZLu_iihw8RV4RdnzQqKGtbo0qPe17GL8jWA1WhGCN1gTa0WYuRQ6UWvrw-RjJVfSaz4eqd0YtcLXdmSmEnTwNtjjERirNKvUSukfLulVraEBukjcS0e4Nfsv1VYNXWspfachv7KPVqUDtR7zTw8ynpOrrdL5j-UUQNcxUZaEKlHbg",
              session_state: null,
            },
          ],
        },
        loginHistory: {
          create: [
            {
              id: "cmhvtt69y0005l10474xeegvj",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-12T09:57:11.302Z",
            },
            {
              id: "cmi67gcd20001jz04dvko17iw",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-19T16:16:49.047Z",
            },
          ],
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "cmhv2z62r0000la04swwqrbxk",
        name: "Elvin Omondi",
        email: "lvntechies@gmail.com",
        emailVerified: null,
        image:
          "https://lh3.googleusercontent.com/a/ACg8ocL51jKFVV77PCusTTtjcJxKRUSKss-SIIYwPVybFUc_N8ZPlz8=s96-c",
        role: "ADMIN",
        hashedPassword: null,
        status: "ACTIVE",
        phone: "+254790670542",
        referralCode: "cmhv2z62r0001la04ip1cj3sz",
        accounts: {
          create: [
            {
              id: "cmhv2z63j0003la0420605hhw",
              type: "oauth",
              provider: "google",
              providerAccountId: "108230557093128090565",
              refresh_token:
                "1//05yH4Z5NbHoRZCgYIARAAGAUSNwF-L9IrbktXlV27afRVSl6CvC8GLryIDBe4SFBA3VVk2HtF1JZfXIhZ-ndpqFBPEV0WEqml5Wk",
              access_token:
                "ya29.a0ATi6K2uLSE_NS_CvsPi5DPZwxkhCLy21fQ8qHqWtO38gGzeOD_-sHYlpEI6HWFOr1zQ7gSROhFb--25wSYL1C1lXR535EkcazYkARcuUotJQraZqEj8nKOdf_a0vluQcBT20o8pNTCY4KlWcqLqpGkPrZfZaPE5_tryaCmnNd4sqIIftmcl3elTrGQ_QB1gxMLfb8VgaCgYKAVQSARESFQHGX2Mi6IX0mzsi89dxrksqhq9sUA0206",
              expires_at: 1762899960,
              token_type: "Bearer",
              scope:
                "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile openid",
              id_token:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6IjRmZWI0NGYwZjdhN2UyN2M3YzQwMzM3OWFmZjIwYWY1YzhjZjUyZGMiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDgyMzA1NTcwOTMxMjgwOTA1NjUiLCJlbWFpbCI6Imx2bnRlY2hpZXNAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJIcmxUN1g3cW42ZGtubFRNanVaMDl3IiwibmFtZSI6IkVsdmluIE9tb25kaSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMNTFqS0ZWVjc3UEN1c1RUdGpjSnhLUlVTS3NzLVNJSVl3UFZ5YkZVY19OOFpQbHo4PXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6IkVsdmluIiwiZmFtaWx5X25hbWUiOiJPbW9uZGkiLCJpYXQiOjE3NjI4OTYzNjEsImV4cCI6MTc2Mjg5OTk2MX0.LR98biWndUED8XOuyzHmgn1_48q84JL6h_fssXH7-gsLsVYMAPnSyNjnQE9zKxiH7O1O12StnKK11vkurRpW_5mF3fFW8BmoHEhaCCKKb6ErvrNekTULPB6Xr3a3kYhib4TO7L2gb-CIC898c7GGzeZRGZQIzzMGPfFD_BNSVe9vvUMH1wlWx35pJIb_Bt66W-R-H7neJmn_Gwl-6GK0tzpbI8n86mi_jNArLeCTZAofwIT7yZpryTr9a8ODmZWhoOynub6XDOn1e1JFTm7YfluFip8M9ht67zfgYM3ywKn5q0xLwki_tjnQ0R2A2aNJxcBPRS1PmpSplyH3NprAKg",
              session_state: null,
            },
          ],
        },
        loginHistory: {
          create: [
            {
              id: "cmhv2z6440005la046y7yx5ok",
              ipAddress: "102.135.172.164",
              createdAt: "2025-11-11T21:26:01.397Z",
            },
            {
              id: "cmhzz8r890001rqnz7ta4yab9",
              ipAddress: "::1",
              createdAt: "2025-11-15T07:40:21.081Z",
            },
          ],
        },
        cart: {
          create: {
            id: "cmhzz9e770003rqnzua0ztsx2",
            createdAt: "2025-11-15T07:40:50.851Z",
            updatedAt: "2025-11-15T07:40:50.851Z",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "cmi38tfx30000jv045vq9ypwf",
        name: "Wilson Wambua",
        email: "wambuawilson@gmail.com",
        emailVerified: "2025-11-17T14:32:02.285Z",
        image: null,
        role: "ADMIN",
        hashedPassword:
          "$2b$10$HFNK7namHfnZb.yuXY.14OYqhv9Ds8SYGqv4XP1ck/mNUxU7y4peO",
        status: "ACTIVE",
        phone: "+254724712588",
        referralCode: "cmi38tfx30001jv04kk5s1lju",
        loginHistory: {
          create: [
            {
              id: "cmi38ugx70003jv04ar7d9vbn",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-17T14:32:29.227Z",
            },
            {
              id: "cmi38w9io0001jm04h45kjziz",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-17T14:33:52.944Z",
            },
            {
              id: "cmi398vf60003jm04h18qk0i1",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-17T14:43:41.202Z",
            },
          ],
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "cmhvt0b7i0000lb04cr6kq8fr",
        name: "CONCEPT ADMIN",
        email: "support@conceptbuilders.co.ke",
        emailVerified: "2025-11-12T15:04:12.659Z",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763392314151-Classic-Two-Story-Family-Home3.webp",
        role: "ADMIN",
        hashedPassword:
          "$2b$10$WGkDKKhPWZJeWty0vhXvTecLLmU31zJQWn4sinUiQqYUGHw7WvCra",
        status: "ACTIVE",
        phone: "+254792156094",
        referralCode: "cmhvt0b7i0001lb04kdwqguqw",
        folders: {
          create: [
            {
              id: "cmi31wo0u000drqy8hpn9x5zk",
              name: "chevrons",
              createdAt: "2025-11-17T11:18:14.430Z",
              updatedAt: "2025-11-17T11:18:14.430Z",
            },
          ],
        },
        loginHistory: {
          create: [
            {
              id: "cmhx7sa0i0001l404kjd8dvfl",
              ipAddress: "102.135.169.105",
              createdAt: "2025-11-13T09:16:10.290Z",
            },
            {
              id: "cmhx7w66b0001jy04fa3a10ix",
              ipAddress: "102.135.169.105",
              createdAt: "2025-11-13T09:19:11.940Z",
            },
            {
              id: "cmhyj5qd60001l504nv9effne",
              ipAddress: "102.135.169.102",
              createdAt: "2025-11-14T07:22:19.963Z",
            },
            {
              id: "cmi1xs45b0001rqacjxno3d4y",
              ipAddress: "::1",
              createdAt: "2025-11-16T16:34:57.407Z",
            },
            {
              id: "cmi3ag1tu0001l204hfqcm6nj",
              ipAddress: "102.135.172.166",
              createdAt: "2025-11-17T15:17:15.714Z",
            },
            {
              id: "cmi7svgo20001rqc1188ek58d",
              ipAddress: "::1",
              createdAt: "2025-11-20T19:04:12.578Z",
            },
          ],
        },
        cart: {
          create: {
            id: "cmi1xsorq0003rqacltux35sw",
            createdAt: "2025-11-16T16:35:23.816Z",
            updatedAt: "2025-11-16T16:35:23.816Z",
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        id: "cmi3clnqm0002jr04f7sqlg6q",
        name: "House 2",
        email: "marvinkilinga@gmail.com",
        emailVerified: null,
        image:
          "https://lh3.googleusercontent.com/a/ACg8ocJbbnIj_brpylEs0fPL6b-EWRukh8q2keagyqCiz_TBZrl3T_IB=s96-c",
        role: "ADMIN",
        hashedPassword: null,
        status: "ACTIVE",
        phone: "+254708591660",
        referralCode: "cmi3clnqm0003jr045k1xne5a",
        accounts: {
          create: [
            {
              id: "cmi3clnqu0005jr04t9feao9b",
              type: "oauth",
              provider: "google",
              providerAccountId: "100986779601121306096",
              refresh_token:
                "1//05sj1Lsgobv-WCgYIARAAGAUSNwF-L9IrCNhapvA8QRZ-wkr9xHoLec7SNOe2gHfpJNf1sdIwL1VaHa9DH0zDnMSlz1u0t63Mdb0",
              access_token:
                "ya29.a0ATi6K2tYgiQ856JPERp4tbr2HOEuO2X4FNBc7A4CBx9C1m2V8fnGr-MNgM_a3nrvF6nEIj3L7uIK2iTEu0PqZjK0F_YdpykMUI5Ql9yEHIVwOlN3thTGBLfVsCBs3LNsJoGvGMlrjxs79h0XuNwgJp6HUGPzVbclVVSVVXi_7mpb3WJkOocBX640j-TL94OYECENg8YaCgYKAa8SARASFQHGX2MiQlST3vcm9ce66faAm0ZQRA0206",
              expires_at: 1763399855,
              token_type: "Bearer",
              scope:
                "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
              id_token:
                "eyJhbGciOiJSUzI1NiIsImtpZCI6ImE1NzMzYmJiZDgxOGFhNWRiMTk1MTk5Y2Q1NjhlNWQ2ODUxMzJkM2YiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MDkxMTYxNDAyNjctZzJuM3EzMGk4azZhN3R1aWJtbjc1bTY1YWFmMWJpdGUuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDA5ODY3Nzk2MDExMjEzMDYwOTYiLCJlbWFpbCI6Im1hcnZpbmtpbGluZ2FAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiIyVjV5MlFJVExIMk9WcDNkSHhmTXpnIiwibmFtZSI6IkhvdXNlIDIiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSmJibklqX2JycHlsRXMwZlBMNmItRVdSdWtoOHEya2VhZ3lxQ2l6X1RCWnJsM1RfSUI9czk2LWMiLCJnaXZlbl9uYW1lIjoiSG91c2UiLCJmYW1pbHlfbmFtZSI6IjIiLCJpYXQiOjE3NjMzOTYyNTYsImV4cCI6MTc2MzM5OTg1Nn0.K3-MiUTLxCNOK55oEVSckTCp7SHxegWHmxfPXxcSNHV_1_KnvGuHlMRNnHfFq2lrWVWg9St-RzsMkmV2f6-msFTmvrXZTtYFkAjle6vGKOMfRN7z8KHG39TCmCQ4fiqpEnHRKlHi8eGJr7iqaaIi6wm4j7uiwcBlXmtXq-GH8PPY_iiVVZMSUbs6iaur3smFG5romjT6gHDZud4vool430ZaFAdxU5k8t2KMQeQY-j1TFe6MiWxyqsUavgAKSSlNR_xVzIjhhJR3BoRHk_wMLhNLwnNwwBQfEdGh4xj_6EcrjR1-WBS6N_BiK2WhBOBDFm-SiUaTs4MKBN44-UrBoA",
              session_state: null,
            },
          ],
        },
        loginHistory: {
          create: [
            {
              id: "cmi3clnr60007jr04owhgldzt",
              ipAddress: "197.248.118.217",
              createdAt: "2025-11-17T16:17:36.643Z",
            },
          ],
        },
      },
    }),
  ]);

  // Create Categories
  console.log("Creating categories...");
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        id: "cmhxhe3960000lg04xcvukm20",
        name: "Modern House Plans",
        isFeatured: false,
      },
    }),
    prisma.category.create({
      data: {
        id: "cmhxhejm10001lg04femnny1q",
        name: "Apartment Plans",
        isFeatured: false,
      },
    }),
    prisma.category.create({
      data: {
        id: "cmhxhf82h0002lg04j286j8ez",
        name: "Modern Farm House Plans",
        isFeatured: false,
      },
    }),
    prisma.category.create({
      data: {
        id: "cmhxhfozj0003lg04l396698s",
        name: "Garage House Plans",
        isFeatured: false,
      },
    }),
    prisma.category.create({
      data: {
        id: "cmhxhgv290004lg04tl5t7lv4",
        name: "Duplex & Multi-Family House Plans",
        isFeatured: false,
      },
    }),
    prisma.category.create({
      data: {
        id: "cmhxhhh880005lg04cyw9rzc9",
        name: "Commercial Buildings",
        isFeatured: false,
      },
    }),
  ]);

  // Create Banners
  console.log("Creating banners...");
  const banners = await Promise.all([
    prisma.banner.create({
      data: {
        id: "cmi4c9v6c0000jx04z0q8bqkv",
        description:
          "We turn dreams into reality with exceptional architectural designs and quality craftsmanship tailored to your needs and lifestyle",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763456171240-A_13 - Photo (8).jpg",
        title: "Your Dream. Our Blueprint.",
      },
    }),
    prisma.banner.create({
      data: {
        id: "cmi4cbmgv0001jx046yvf6mn2",
        description:
          "Where Vision Meets Precision. We collaborate with you to achieve a shared vision, ensuring a seamless journey from concept to keys.",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763456253468-A_13 - Photo.jpg",
        title: "Your Vision, Our Precision.",
      },
    }),
    prisma.banner.create({
      data: {
        id: "cmi4cdm4p0002jx04y2zknkse",
        description:
          "From initial design concepts to final construction, we offer a seamless and personalized experience to transform your dream home into a reality.",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763456346215-A_17 - Photo (11).jpg",
        title: "Core Promise Building Dreams, One Home at a Time.",
      },
    }),
    prisma.banner.create({
      data: {
        id: "cmi3cef1o0001jr04udtws9hn",
        description:
          "Explore our curated collections of house plans and start your journey to homeownership today.",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763395917465-IMG_20250703_165532_700.jpg",
        title: "Build your Dream Home",
      },
    }),
    prisma.banner.create({
      data: {
        id: "cmi4d7qlw0003jx04inrkyhkj",
        description:
          "Find the perfect balance of luxury and affordability with our range of House plans.",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763563958663-A_9 - Photo.jpg",
        title: "Luxurious and Affordable Designs",
      },
    }),
    prisma.banner.create({
      data: {
        id: "cmi4dapmd0004jx04psgioyg1",
        description:
          "Our team of experts can help you customize any of our plans to create your perfect home.",
        image:
          "https://concept-builders.sfo3.digitaloceanspaces.com/designs/1763564065464-A_2 - Photo.jpg",
        title: "Customizable plans to fit your Needs",
      },
    }),
  ]);

  console.log("Seed completed successfully!");
  console.log(`Created ${users.length} users`);
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${banners.length} banners`);
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
