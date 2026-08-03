const initialReviews = [
  {
    id: "REV-101",
    name: "Dr. Ananya & Karthik Subramanian",
    location: "Chennai, Tamil Nadu",
    trip: "Honeymoon Special Package",
    rating: 5,
    review: "Sulthan Ibrahim sir made our honeymoon in Kodaikanal truly unforgettable! The Innova cab was spotless, and driver Murugan knew every scenic hidden spot. 10/10 service!",
    date: "2 days ago"
  },
  {
    id: "REV-102",
    name: "Rajesh Kumar & Family",
    location: "Bengaluru, Karnataka",
    trip: "Family Sightseeing (3 Days)",
    rating: 5,
    review: "Punctual pickup from Madurai station directly to Kodai. Fair transparent daily pricing without any surprise toll fees. Highly recommended travel agency!",
    date: "1 week ago"
  },
  {
    id: "REV-103",
    name: "Meera & Corporate Team",
    location: "Kochi, Kerala",
    trip: "Tempo Traveller Group Outing",
    rating: 5,
    review: "Clean 12-seater Tempo Traveller for our team outing to Mannavanur sheep farm and Berijam lake. Very polite driver who navigated mountain curves smoothly.",
    date: "2 weeks ago"
  }
];

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    let body = req.body || {};
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch(e){}
    }
    const newRev = {
      id: "REV-" + Date.now(),
      name: body.name || "Guest Traveller",
      location: body.location || "Verified Guest",
      trip: body.trip || "Kodaikanal Tour",
      rating: parseInt(body.rating) || 5,
      review: body.review || "Wonderful experience with Travellers Inn!",
      date: "Just now"
    };
    initialReviews.unshift(newRev);
    return res.status(201).json({ status: "Success", review: newRev });
  }

  res.status(200).json(initialReviews);
};
