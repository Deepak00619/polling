const form = document.getElementById('vote-form');

// Form Submit Event
form.addEventListener('submit', e => {
  const choice = document.querySelector('input[name=js]:checked').value;
  const data = { js: choice };

  fetch('http://localhost:3000/poll', { 
    method: 'post', 
    body: JSON.stringify(data), 
    headers: new Headers({
      'Content-Type': 'application/json'
    })
  }).catch(err => console.log(err));

  e.preventDefault();
});

// Load on Startup
fetch('http://localhost:3000/poll')
  .then(res => res.json())
  .then(data => {
    const votes = data.votes;
    const totalVotes = votes.length;
    document.querySelector('#chartTitle').textContent=`Total Votes: ${totalVotes}`;

    // Refresh the Total Votes every 2 seconds
    setInterval(() => {
      fetch('http://localhost:3000/poll')
        .then(res => res.json())
        .then(data => document.querySelector('#chartTitle').textContent = `Total Votes: ${data.votes.length}`)
        .catch(err => console.log(err));
      }, 2000);

    // Count vote points - accumulator/current value
    const voteCounts = votes.reduce((acc, vote) => ((acc[vote.js] = (acc[vote.js] || 0) + vote.points), acc), {});

    // Set initial Data Points
    if (Object.keys(voteCounts).length === 0 && voteCounts.constructor === Object) {
      voteCounts.Angular = 0;
      voteCounts.React = 0;
      voteCounts.VueJS = 0;
      voteCounts.Other = 0;
    }

    // Set Data Points
    let dataPoints = [
      { label: 'Angular', y: voteCounts.Angular },
      { label: 'React', y: voteCounts.React },
      { label: 'VueJS', y: voteCounts.VueJS },
      { label: 'Other', y: voteCounts.Other }
    ];

    // Set Custom Colors
    CanvasJS.addColorSet("myColors", ["#b52e31", "#00d8ff", "#42b883", "#f7df1e"]);

    // Create CanvasJS Chart
    const chartContainer = document.querySelectorAll('#chartContainer');
    if (chartContainer) {
      const chart = new CanvasJS.Chart('chartContainer', {
        animationEnabled: true,
        theme: 'theme1',
        colorSet: "myColors",
        data: [
          {
            type: 'column',
            dataPoints: dataPoints
          }
        ]
      });
      chart.render();

      const pusher = new Pusher('319ef1a8581aff11ac6c', {
        cluster: 'us2',
        encrypted: true
      });

      const channel = pusher.subscribe('js-poll');
      channel.bind('js-vote', function (data) {
        dataPoints = dataPoints.map(x => {
          if (x.label === data.js) {
            x.y += data.points;
            return x;
          } else {
            return x;
          }
        });
        chart.render();
      });
    }
  });
