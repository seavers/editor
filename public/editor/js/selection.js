(function () {



      $(document).on("iframeload",function(){

            console.log("iframeload")
           $(play.iframeDoc).on("selectstart", function(){
               var selObj = window.getSelection();
               console.log(selObj.rangeCount);


           })

      })


})();