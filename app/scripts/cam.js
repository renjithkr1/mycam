'use strict'

angular.module('mycam', []).directive('mycam', function () {
    return {
        template: '<div ng-transclude></div>',
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:
        {
            onError: '&',
            onStream: '&',
            onStreaming: '&',
            placeholder: '=',
            config: '=channel'
        },
        link: function postLink($scope, element) {

            var videoElement = null;
            var videoStream = null;

            var successCallback = function successCallback(videoStream) {
                videoElement.srcObject = videoStream;
                videoElement.play();
                $scope.config.video = videoElement;
                if ($scope.onStream) {
                    $scope.onStream({ stream: stream });
                }
            }

            var errorCallback = function errorCallback(error) {

                if (console && console.log) {
                    console.log('The following error occured: ', error);
                }

                if ($scope.onError) {
                    $scope.onError({ error: error });
                }

                return;
            };


            function startCam() {
                videoElement = document.createElement('video');
                // videoElem.setAttribute('class', 'webcam-live');
                videoElement.setAttribute('autoplay', '');
                element.append(videoElement);

                var isStreaming = false;
                var width = element.width = 320;
                var height = element.height = 0;


                // if (!window.navigator.mediaDevices.getUserMedia()) {
                //     errorCallback({ code: -1, msg: 'Browser does not support getUserMedia.' });
                //     return;
                // }

                // var constraints = {
                //     audio: true,
                //     video: {
                //         width: { ideal: 1280 },
                //         height: { ideal: 720 }
                //     }
                // };
                navigator.mediaDevices.getUserMedia({video : true}, successCallback, errorCallback);

                videoElement.addEventListener('canplay', function () {
                    if (!isStreaming) {
                        var scale = width / videoElement.videoWidth;
                        height = (videoElement.videoHeight * scale)
                        videoElement.setAttribute('width', width);
                        videoElement.setAttribute('height', height);
                        isStreaming = true;
                        $scope.config.video = videoElement;
                        if ($scope.onStreaming) {
                            $scope.onStreaming();
                        }
                    }
                }, false);

            }

            startCam();
        }
    }
});