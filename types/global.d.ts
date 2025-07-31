// declare global {
//     var mongoose: {
//       conn: any
//       promise: any
//     }
//   }
  
//   export {}
  
  declare global {
    var mongoose: {
      conn: typeof import("mongoose") | null
      promise: Promise<typeof import("mongoose")> | null
    }
  }
  
  export {}
  