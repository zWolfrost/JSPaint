self.onmessage = function(e)
{
   postMessage(e.data.dataCompress().LZStringCompress());
};

Object.prototype.dataCompress = function()
{
   let compressedData = "", pixelCount = 1;

   for (let i=0; i < this.length; i+=4)
   {
      let curPixel = "" +  this[i] + this[i+1] + this[i+2] + this[i+3];
      let nextPixel = "" + this[i+4] + this[i+5] + this[i+6] + this[i+7];

      if (curPixel === nextPixel) pixelCount++;

      else
      {
         compressedData += pixelCount + "," + this[i] + "," + this[i+1] + "," + this[i+2] + "," + this[i+3] + ",";
         pixelCount = 1;
      }
   }

   return compressedData.slice(0, -1);
};

String.prototype.LZStringCompress = function()
{
   let uncompressed = this;
   let bitsPerChar = 16;
   let getCharFromInt = function(a){return String.fromCharCode(a);}

   if (uncompressed == null) return "";
   var i, value,
       context_dictionary= {},
       context_dictionaryToCreate= {},
       context_c="",
       context_wc="",
       context_w="",
       context_enlargeIn= 2,
       context_dictSize= 3,
       context_numBits= 2,
       context_data=[],
       context_data_val=0,
       context_data_position=0,
       ii;

   for (ii = 0; ii < uncompressed.length; ii += 1) {
     context_c = uncompressed.charAt(ii);
     if (!Object.prototype.hasOwnProperty.call(context_dictionary,context_c)) {
       context_dictionary[context_c] = context_dictSize++;
       context_dictionaryToCreate[context_c] = true;
     }

     context_wc = context_w + context_c;
     if (Object.prototype.hasOwnProperty.call(context_dictionary,context_wc)) {
       context_w = context_wc;
     } else {
       if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
         if (context_w.charCodeAt(0)<256) {
           for (i=0 ; i<context_numBits ; i++) {
             context_data_val = (context_data_val << 1);
             if (context_data_position == bitsPerChar-1) {
               context_data_position = 0;
               context_data.push(getCharFromInt(context_data_val));
               context_data_val = 0;
             } else {
               context_data_position++;
             }
           }
           value = context_w.charCodeAt(0);
           for (i=0 ; i<8 ; i++) {
             context_data_val = (context_data_val << 1) | (value&1);
             if (context_data_position == bitsPerChar-1) {
               context_data_position = 0;
               context_data.push(getCharFromInt(context_data_val));
               context_data_val = 0;
             } else {
               context_data_position++;
             }
             value = value >> 1;
           }
         } else {
           value = 1;
           for (i=0 ; i<context_numBits ; i++) {
             context_data_val = (context_data_val << 1) | value;
             if (context_data_position ==bitsPerChar-1) {
               context_data_position = 0;
               context_data.push(getCharFromInt(context_data_val));
               context_data_val = 0;
             } else {
               context_data_position++;
             }
             value = 0;
           }
           value = context_w.charCodeAt(0);
           for (i=0 ; i<16 ; i++) {
             context_data_val = (context_data_val << 1) | (value&1);
             if (context_data_position == bitsPerChar-1) {
               context_data_position = 0;
               context_data.push(getCharFromInt(context_data_val));
               context_data_val = 0;
             } else {
               context_data_position++;
             }
             value = value >> 1;
           }
         }
         context_enlargeIn--;
         if (context_enlargeIn == 0) {
           context_enlargeIn = Math.pow(2, context_numBits);
           context_numBits++;
         }
         delete context_dictionaryToCreate[context_w];
       } else {
         value = context_dictionary[context_w];
         for (i=0 ; i<context_numBits ; i++) {
           context_data_val = (context_data_val << 1) | (value&1);
           if (context_data_position == bitsPerChar-1) {
             context_data_position = 0;
             context_data.push(getCharFromInt(context_data_val));
             context_data_val = 0;
           } else {
             context_data_position++;
           }
           value = value >> 1;
         }


       }
       context_enlargeIn--;
       if (context_enlargeIn == 0) {
         context_enlargeIn = Math.pow(2, context_numBits);
         context_numBits++;
       }

       context_dictionary[context_wc] = context_dictSize++;
       context_w = String(context_c);
     }
   }


   if (context_w !== "") {
     if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate,context_w)) {
       if (context_w.charCodeAt(0)<256) {
         for (i=0 ; i<context_numBits ; i++) {
           context_data_val = (context_data_val << 1);
           if (context_data_position == bitsPerChar-1) {
             context_data_position = 0;
             context_data.push(getCharFromInt(context_data_val));
             context_data_val = 0;
           } else {
             context_data_position++;
           }
         }
         value = context_w.charCodeAt(0);
         for (i=0 ; i<8 ; i++) {
           context_data_val = (context_data_val << 1) | (value&1);
           if (context_data_position == bitsPerChar-1) {
             context_data_position = 0;
             context_data.push(getCharFromInt(context_data_val));
             context_data_val = 0;
           } else {
             context_data_position++;
           }
           value = value >> 1;
         }
       } else {
         value = 1;
         for (i=0 ; i<context_numBits ; i++) {
           context_data_val = (context_data_val << 1) | value;
           if (context_data_position == bitsPerChar-1) {
             context_data_position = 0;
             context_data.push(getCharFromInt(context_data_val));
             context_data_val = 0;
           } else {
             context_data_position++;
           }
           value = 0;
         }
         value = context_w.charCodeAt(0);
         for (i=0 ; i<16 ; i++) {
           context_data_val = (context_data_val << 1) | (value&1);
           if (context_data_position == bitsPerChar-1) {
             context_data_position = 0;
             context_data.push(getCharFromInt(context_data_val));
             context_data_val = 0;
           } else {
             context_data_position++;
           }
           value = value >> 1;
         }
       }
       context_enlargeIn--;
       if (context_enlargeIn == 0) {
         context_enlargeIn = Math.pow(2, context_numBits);
         context_numBits++;
       }
       delete context_dictionaryToCreate[context_w];
     } else {
       value = context_dictionary[context_w];
       for (i=0 ; i<context_numBits ; i++) {
         context_data_val = (context_data_val << 1) | (value&1);
         if (context_data_position == bitsPerChar-1) {
           context_data_position = 0;
           context_data.push(getCharFromInt(context_data_val));
           context_data_val = 0;
         } else {
           context_data_position++;
         }
         value = value >> 1;
       }


     }
     context_enlargeIn--;
     if (context_enlargeIn == 0) {
       context_enlargeIn = Math.pow(2, context_numBits);
       context_numBits++;
     }
   }


   value = 2;
   for (i=0 ; i<context_numBits ; i++) {
     context_data_val = (context_data_val << 1) | (value&1);
     if (context_data_position == bitsPerChar-1) {
       context_data_position = 0;
       context_data.push(getCharFromInt(context_data_val));
       context_data_val = 0;
     } else {
       context_data_position++;
     }
     value = value >> 1;
   }


   while (true) {
     context_data_val = (context_data_val << 1);
     if (context_data_position == bitsPerChar-1) {
       context_data.push(getCharFromInt(context_data_val));
       break;
     }
     else context_data_position++;
   }
   return context_data.join('');
};