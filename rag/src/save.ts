import { storeConversation } from ".";
import * as dotenv from 'dotenv';
dotenv.config();

const transcript = `
This is the primary reason I have come in. I have attempted to take a little bit of Tylenol to relieve the pain, but it is not really seeming to help much.

Before we talk a little bit more about that, is there anything else that you want to talk with either me or Dr. Smith today?

Not that I can think of now.

Okay.

Tell me more about this pain.

It's just kind of a throbbing pain. It acts kind of randomly throughout the day. It doesn't seem specific to the morning or evening, or even in the middle of the day or night. It just kind of randomly acts up. I would say, excessively, like when I'm doing work — after the dishes, it'll start to act up. If I lift one of my children up, it'll start to act up. So any sort of exertion is kind of where I've noticed a lot of the pain coming from.

And tell me, when did it start for you?

I would say about maybe a week and a half to two weeks ago.

You described the pain as throbbing. Is there anything else about the pain in terms of the quality that you want to describe for me?

No, just really throbbing.

Okay, started about a week to two weeks ago.

Do you recall what you were doing at the time that it started?

I've been helping my husband clean out the garage lately, and we were lifting some boxes. I didn't notice it at the moment, but later in the evening, it started to act up.

Okay.

I'd like to hear a little bit about the severity on a pain scale of 1 to 10, 10 being the worst pain you've ever had, and 1 or 0 being no pain. How would you rate this pain?

I would measure it probably about a six or seven.

Six or seven?

Yes. It's become more of a nuisance than an actual physical pain.

Okay.

Is it a six or seven all the time?

Whenever it starts to act up, yes.

Okay.

And how often a day has that happened?

I would say maybe two to three times per day.

Do you notice any pattern to that at all?

No.

Okay.

All righty.

Can you point exactly to where it is for me? The location of it exactly.

Kind of the area that just wraps around the actual elbow.

Okay.

That is really bothering me. Does that pain go up your arm or down your arm or anywhere else on your arm?

No, it stays straight in that area.

Okay.

Is there anything else that goes on at the same time? Any other symptoms that happen? Anything else other than when the pain is happening there? Anything else going on for you?

Not that I've noticed.

No.

Okay.

All righty.

Is there anything that makes it feel better?

Nothing that completely gets rid of it. Tylenol will relieve it for a temporary period of time, but it hasn't gotten rid of it.

And how much Tylenol do you take?

I take, as it says on the bottle, usually one to two tablets.

Is that regular strength or extra strength?

Regular strength.

Okay.

And you just take it over the counter, following the normal directions from the bottle?

Yes.

Okay.

Does anything make it worse?

Like I mentioned, any sort of exertion — picking up a child, doing the dishes — pretty much daily living causes it to worsen.

Okay.

All right.

Have you seen anybody else for this complaint?

No.

What else have you tried other than the Tylenol?

I've attempted to use a heating pad on it and also attempted ice. Neither were successful.

Okay.

It sounds like you've talked a little bit about how it's impacted you — being able to work in the garage, do the dishes, or lift your child. Is there other impact on your life?

Well, like I mentioned, it's more of a nuisance. There will be times in the middle of the night that it will start to act up. If I get up to go to the bathroom, I'll notice pain in my elbow.

Does it wake you at night?

It doesn't, but if I wake up in the middle of the night, it will trouble me before I fall back asleep.

Okay.

What do you think it is?

I'm not quite sure. My best guess is maybe it's some sort of pulled muscle or something, but I honestly don't know.

All right.

What I'd like to do now is just kind of go through all the things that you've told me and summarize them for you. This is information that I want to take back, but I want to make sure I have it all correct. So if I've forgotten something or gotten something incorrect, please help me.

Okay.

You came to the clinic today for a complaint of left elbow pain. It's pain that you mostly notice when bending it or using it in some capacity. It's a throbbing pain that happens randomly, but it does happen two to three times during the day. What you notice is that if you exert yourself or extend or flex your elbow, that's when it seems to be at its worst. It's been going on for about one to two weeks, when you think back on it. It started when you were helping your husband clean the garage and lifting boxes.

It's about a six to seven on the pain scale, and you describe it repeatedly as a nuisance, which tells me that it's getting in the way of doing some things you want to do. You report that it happens two to three times a day and that the pain wraps around the joint completely.

You've taken some Tylenol over the counter several times a day, without much relief. It hasn't helped much. You've also tried a heating pad and ice, but neither has helped much.

It sounds like, again, you keep referring to it as a nuisance. It's just getting in the way of your daily activities. It doesn't necessarily keep you up at night, but you do notice it at night when you wake up, that it's still going on. Sleep doesn't seem to help much.

What you mostly think this could be is a pulled muscle of some type.

Is there anything I've forgotten or that you wanted to tell me about this?

Not that I can think of, no.

Thank you for telling me about your chief concern. I'm going to take it back to Dr. Smith. Thank you very much.
`;

const transcript2 = `
Customer: Hi, I'm having trouble with my software subscription. It says my payment didn't go through, but I checked my bank, and the payment was deducted.

Support Agent: I'm sorry to hear that. Can you please provide your account email or subscription ID so I can look into it?

Customer: Sure, it's john.doe@example.com.

Support Agent: Thank you. Please give me a moment to check your account.

Support Agent: It looks like the payment was received, but the subscription wasn't activated due to a system error. I will manually activate your subscription right now.

Customer: That would be great, thanks!

Support Agent: Done. You should now have full access to all features. Please try logging in again.

Customer: I just logged in and it works perfectly now. Appreciate the quick help!

Support Agent: You're welcome! Is there anything else I can assist you with today?

Customer: No, that's all. Thanks again!

Support Agent: Have a great day!
`;


const sessionId = "cmdz0n3d90001v2pgzuyfbz81";


storeConversation(sessionId, transcript);
