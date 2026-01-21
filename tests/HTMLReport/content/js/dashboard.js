/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "JSR223 Sampler - JMeter Props"], "isController": false}, {"data": [0.0, 500, 1500, "Get by Id"], "isController": false}, {"data": [0.0, 500, 1500, "Get All Items"], "isController": false}, {"data": [0.0, 500, 1500, "Update item by Id"], "isController": false}, {"data": [0.0, 500, 1500, "Get by Id After Updating"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": false}, {"data": [0.0, 500, 1500, "Create_Item"], "isController": false}, {"data": [0.0, 500, 1500, "Create_User"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 825, 825, 100.0, 1.0533333333333326, 0, 825, 0.0, 0.0, 1.0, 1.0, 6.69599376663853, 7.372052938425265, 0.0], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["JSR223 Sampler - JMeter Props", 1, 1, 100.0, 825.0, 825, 825, 825.0, 825.0, 825.0, 825.0, 1.2121212121212122, 0.0, 0.0], "isController": false}, {"data": ["Get by Id", 107, 107, 100.0, 0.009345794392523364, 0, 1, 0.0, 0.0, 0.0, 0.9200000000000017, 1.1135741567537754, 1.2310214310988998, 0.0], "isController": false}, {"data": ["Get All Items", 116, 116, 100.0, 0.008620689655172417, 0, 1, 0.0, 0.0, 0.0, 0.8299999999999983, 1.114912921456307, 1.2259687007419937, 0.0], "isController": false}, {"data": ["Update item by Id", 102, 102, 100.0, 0.0784313725490196, 0, 1, 0.0, 0.0, 1.0, 1.0, 1.095196168960852, 1.2107051399059419, 0.0], "isController": false}, {"data": ["Get by Id After Updating", 98, 98, 100.0, 0.06122448979591837, 0, 1, 0.0, 0.0, 1.0, 1.0, 1.197619425875912, 1.323930849698762, 0.0], "isController": false}, {"data": ["Login", 135, 135, 100.0, 0.06666666666666668, 0, 1, 0.0, 0.0, 1.0, 1.0, 1.2013134360233857, 1.3209755165647776, 0.0], "isController": false}, {"data": ["Create_Item", 123, 123, 100.0, 0.048780487804878044, 0, 1, 0.0, 0.0, 0.7999999999999972, 1.0, 1.1881876756923848, 1.306542307450806, 0.0], "isController": false}, {"data": ["Create_User", 143, 143, 100.0, 0.09090909090909094, 0, 4, 0.0, 0.0, 1.0, 2.680000000000007, 1.2470785223427634, 1.3749527848876757, 0.0], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/login", 135, 16.363636363636363, 16.363636363636363], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items", 239, 28.96969696969697, 28.96969696969697], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items/NO_ID", 307, 37.21212121212121, 37.21212121212121], "isController": false}, {"data": ["500/javax.script.ScriptException: groovy.lang.MissingPropertyException: No such property: sampleResult for class: Script1", 1, 0.12121212121212122, 0.12121212121212122], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/register", 143, 17.333333333333332, 17.333333333333332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 825, 825, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items/NO_ID", 307, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items", 239, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/register", 143, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/login", 135, "500/javax.script.ScriptException: groovy.lang.MissingPropertyException: No such property: sampleResult for class: Script1", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["JSR223 Sampler - JMeter Props", 1, 1, "500/javax.script.ScriptException: groovy.lang.MissingPropertyException: No such property: sampleResult for class: Script1", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get by Id", 107, 107, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items/NO_ID", 107, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get All Items", 116, 116, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items", 116, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Update item by Id", 102, 102, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items/NO_ID", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Get by Id After Updating", 98, 98, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items/NO_ID", 98, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Login", 135, 135, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/login", 135, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create_Item", 123, 123, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/items", 123, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["Create_User", 143, 143, "Non HTTP response code: org.apache.http.client.ClientProtocolException/Non HTTP response message: URI does not specify a valid host name: http:/register", 143, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
