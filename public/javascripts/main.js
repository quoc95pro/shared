var theToggle = document.getElementById('toggle-header');
          var menu = document.getElementById('menu-header');
      
      // hasClass
      function hasClass(elem, className) {
        return new RegExp(' ' + className + ' ').test(' ' + elem.className + ' ');
      }
      
      // toggleClass
      function toggleClass(elem, className) {
        var newClass = ' ' + elem.className.replace( /[\t\r\n]/g, " " ) + ' ';
          if (hasClass(elem, className)) {
              while (newClass.indexOf(" " + className + " ") >= 0 ) {
                  newClass = newClass.replace( " " + className + " " , " " );
              }
              elem.className = newClass.replace(/^\s+|\s+$/g, '');
          } else {
              elem.className += ' ' + className;
          }
      }
      
      theToggle.onclick = function() {
         toggleClass(this, 'on');
         toggleClass(menu, 'menu-header-toggled');
         
         return false;
      }
      
      function toggleMenu(elem){
        
        if (hasClass(elem, 'on')) {
          while (newClass.indexOf(" " + className + " ") >= 0 ) {
              newClass = newClass.replace( " " + className + " " , " " );
          }
          elem.className = newClass.replace(/^\s+|\s+$/g, '');
      } else {
          elem.className += ' ' + className;
      }
      }