self.onmessage = function(e)
{
   postMessage(e.data.LZStringDecompress().dataDecompress());
};

Object.prototype.dataDecompress = function()
{
   let splitData = this.split(",");
   let decompressedData = [];

   for (let i=0; i < splitData.length; i+=5)
   {
      for (let j=0; j < splitData[i]; j++)
      {
         decompressedData.push(splitData[i+1]);
         decompressedData.push(splitData[i+2]);
         decompressedData.push(splitData[i+3]);
         decompressedData.push(splitData[i+4]);
      }
   }
   
   return decompressedData;
};

String.prototype.LZStringDecompress = function()
{
   let compressed = this;
   let length = compressed.length;
   let resetValue = 32768;
   let getNextValue = function(index){return compressed.charCodeAt(index);};

   var dictionary = [],
       next,
       enlargeIn = 4,
       dictSize = 4,
       numBits = 3,
       entry = "",
       result = [],
       i,
       w,
       bits, resb, maxpower, power,
       c,
       data = {val:getNextValue(0), position:resetValue, index:1};

   for (i = 0; i < 3; i += 1) {
     dictionary[i] = i;
   }

   bits = 0;
   maxpower = Math.pow(2,2);
   power=1;
   while (power!=maxpower) {
     resb = data.val & data.position;
     data.position >>= 1;
     if (data.position == 0) {
       data.position = resetValue;
       data.val = getNextValue(data.index++);
     }
     bits |= (resb>0 ? 1 : 0) * power;
     power <<= 1;
   }

   switch (next = bits) {
     case 0:
         bits = 0;
         maxpower = Math.pow(2,8);
         power=1;
         while (power!=maxpower) {
           resb = data.val & data.position;
           data.position >>= 1;
           if (data.position == 0) {
             data.position = resetValue;
             data.val = getNextValue(data.index++);
           }
           bits |= (resb>0 ? 1 : 0) * power;
           power <<= 1;
         }
       c = String.fromCharCode(bits);
       break;
     case 1:
         bits = 0;
         maxpower = Math.pow(2,16);
         power=1;
         while (power!=maxpower) {
           resb = data.val & data.position;
           data.position >>= 1;
           if (data.position == 0) {
             data.position = resetValue;
             data.val = getNextValue(data.index++);
           }
           bits |= (resb>0 ? 1 : 0) * power;
           power <<= 1;
         }
       c = String.fromCharCode(bits);
       break;
     case 2:
       return "";
   }
   dictionary[3] = c;
   w = c;
   result.push(c);
   while (true) {
     if (data.index > length) {
       return "";
     }

     bits = 0;
     maxpower = Math.pow(2,numBits);
     power=1;
     while (power!=maxpower) {
       resb = data.val & data.position;
       data.position >>= 1;
       if (data.position == 0) {
         data.position = resetValue;
         data.val = getNextValue(data.index++);
       }
       bits |= (resb>0 ? 1 : 0) * power;
       power <<= 1;
     }

     switch (c = bits) {
       case 0:
         bits = 0;
         maxpower = Math.pow(2,8);
         power=1;
         while (power!=maxpower) {
           resb = data.val & data.position;
           data.position >>= 1;
           if (data.position == 0) {
             data.position = resetValue;
             data.val = getNextValue(data.index++);
           }
           bits |= (resb>0 ? 1 : 0) * power;
           power <<= 1;
         }

         dictionary[dictSize++] = String.fromCharCode(bits);
         c = dictSize-1;
         enlargeIn--;
         break;
       case 1:
         bits = 0;
         maxpower = Math.pow(2,16);
         power=1;
         while (power!=maxpower) {
           resb = data.val & data.position;
           data.position >>= 1;
           if (data.position == 0) {
             data.position = resetValue;
             data.val = getNextValue(data.index++);
           }
           bits |= (resb>0 ? 1 : 0) * power;
           power <<= 1;
         }
         dictionary[dictSize++] = String.fromCharCode(bits);
         c = dictSize-1;
         enlargeIn--;
         break;
       case 2:
         return result.join('');
     }

     if (enlargeIn == 0) {
       enlargeIn = Math.pow(2, numBits);
       numBits++;
     }

     if (dictionary[c]) {
       entry = dictionary[c];
     } else {
       if (c === dictSize) {
         entry = w + w.charAt(0);
       } else {
         return null;
       }
     }
     result.push(entry);

     dictionary[dictSize++] = w + entry.charAt(0);
     enlargeIn--;

     w = entry;

     if (enlargeIn == 0) {
       enlargeIn = Math.pow(2, numBits);
       numBits++;
     }

   }
};