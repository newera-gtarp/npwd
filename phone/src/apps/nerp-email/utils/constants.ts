import { Email } from '@typings/nerp_emails';

const oldDate = new Date();
oldDate.setHours(oldDate.getHours() - 1);

export const BrowserEmailState: Email[] = [
  {
    id: 123,
    citizenid: '1234',
    date: new Date(),
    message:
      'Hi Chuck,<br>I am inquiring about your craigslist posting about eating ass. I love ass and further, I love eating it. Therefore I happily offer to eat your ass. Please have a <i>Chipotle</i> meal no later than 5 hours prior to said ass eating. Thanks! <br><br>Best,<br>Erik',
    sender: 'Erik',
    deleted: false,
    read: false,
    subject: 'RE: offer to eat ass',
  },
  {
    id: 1234,
    citizenid: '1234',
    date: oldDate,
    message: 'emily loves <b>big</b> poopy fart. stink poop butt fart nugget',
    sender: 'BugerShot',
    deleted: false,
    read: false,
    subject: 'New Order Request',
  },
];
