function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;

  d3.json(url).then(function(response){
    var data = response;
    var holder = d3.select("#sample-metadata");
    // .html("") to clear metadata
    holder.html("");

    Object.entries(data).forEach(([key, value]) => {
      holder.append("p")
          .text(`${key}:${value}`);
    });

  });
}
// Hint: Inside the loop, you will need to use d3 to append new
// tags for each key-value in the metadata.

function buildCharts(sample) {
//not pulling samples or any data. dont know why
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function (response){
    var x = response["otu_ids"];
    var y = response["sample_values"];

    var otus = response["otu_labels"];
    var size = response["sample_values"];
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: x,
      y: y,
      mode:"markers",
      marker:{
        size: size,
        color: x,
        colorscale: "Viridis", //color scale get from Alex
        labels: otus,
        type: 'scatter',
        opacity: 0.5
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Size',
      xaxis: { title: 'OTU acro' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,

    var data = [{
      values: size.splice(0, 10),
      labels: x.splice(0, 10),
      text: y.splice(0,10),
      type: 'pie'
    }];
    Plotly.newPlot('pie', data);
  });
}

function init() {
  var selector = d3.select("#selDataset");

  // not working. dont know why -- come back to later
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
          .append("option")
          .text(sample)
          .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

//fix so chart doesnt keep stacking
function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();