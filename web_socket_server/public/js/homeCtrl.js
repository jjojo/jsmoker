robotApp.controller('HomeCtrl', function ($scope,$routeParams,$document) {
	// This file has no code yet.
	//var host = location.origin.replace(/^http/, 'ws')
    var host 	= "ws://localhost:5000/dashboard"
    var ws 		= new WebSocket(host);
	var fired 	= false;
	var sendMsg = function (msg) { ws.send(msg) };

	$scope.events = [];
	$scope.status = "connecting..."
	$scope.labels = [0];
	$scope.data = [[0],[0],[0]]
    ws.onmessage = function (event) {
    	if (event.data === 'smoker connected') {
    		$scope.status = event.data
    		$scope.statusClr = "green"
    	};
    	if (event.data.split(" ").length > 2 && event.data !== "connected to server via websocket"){
    		$scope.temp = event.data.split(" ")[0]
    		$scope.hum = event.data.split(" ")[1] + "%"
    		$scope.smoke = event.data.split(" ")[2] + "%"
    	}
    	if (event.data[0] === "{"){
    		$scope.data = [ JSON.parse(event.data).temps, JSON.parse(event.data).hum, JSON.parse(event.data).smoke  ]
    		if(JSON.parse(event.data).temps.length > 1 && $scope.labels.length !== JSON.parse(event.data).temps.length){
    			for(var i = 0; JSON.parse(event.data).temps.length > i; i++){
    				$scope.labels.push($scope.labels[$scope.labels.length-1] + 5)
    			}
    		}else{
    			$scope.labels.push($scope.labels[$scope.labels.length-1] + 5)
    		}
    		
    	}
    	
    	$scope.events.push(event.data)
    	$scope.$apply()
    };

	$scope.submit = function (msg) {
		// body...
		sendMsg(msg);
	}



	
  $scope.series = ['Temperatur', 'Luftfuktighet', 'Röknivå'];
  // $scope.data = [
  //   [65, 59, 80, 81, 56, 55, 40],
  //   [28, 48, 40, 19, 86, 27, 90]
  // ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                suggestedMax: 150
            }
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          ticks: {
            suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
            suggestedMax: 150
          },
          position: 'right'
        }
      ]
    }
  };

	
	// $document.bind("keydown", function(event) {
	// 	console.log(event)
	// 	if (!fired) {
	// 		fired = true;
	// 		switch(event.keyCode) {
	// 		    case 38:
	// 		        $scope.keyUpColor = "green"
	//         		$scope.$apply()
	//         		setTimeout(ws.send('F1'), 10)
	// 		        break;
	// 		     case 39:
	// 		        $scope.keyRightColor = "green"
	//         		$scope.$apply()
	//         		setTimeout(ws.send('r1'), 10)
	// 		        break;
	// 		     case 40:
	// 		        $scope.keyDownColor = "green"
	//         		$scope.$apply()
	//         		setTimeout(ws.send('R1'), 10)
	// 		        break;
	// 		     case 37:
	// 		        $scope.keyLeftColor = "green"
	//         		$scope.$apply()
	//         		setTimeout(ws.send('l1'), 10)
	// 		        break;
	// 		    default: 
	// 		       	$scope.keyColor = "none";
	// 		}
	// 	};
 //     });


 //    $document.bind("keyup", function(event) {
 //    	console.log(event)
 //    	fired = false;
 //        switch(event.keyCode) {
	// 	    case 38:
	// 	        $scope.keyUpColor = "none"
 //        		$scope.$apply()
 //        		setTimeout(ws.send('F0'), 5)
	// 	        break;
	// 	     case 39:
	// 	        $scope.keyRightColor = "none"
 //        		$scope.$apply()
 //        		setTimeout(ws.send('r0'), 5)
	// 	        break;
	// 	     case 40:
	// 	        $scope.keyDownColor = "none"
 //        		$scope.$apply()
 //        		setTimeout(ws.send('R0'), 5)
	// 	        break;
	// 	     case 37:
	// 	        $scope.keyLeftColor = "none"
 //        		$scope.$apply()
 //        		setTimeout(ws.send('l0'), 5)
	// 	        break;
	// 	    default: 
	// 	       	$scope.keyColor = "none";
	// 	}
 //    });


    $scope.startLog = function (argument) {
    	console.log("start-log")
    	ws.send("start-log")
    }

    $scope.stopLog = function (argument) {
    	console.log("stop-log")
    	ws.send("stop-log")
    }

});
