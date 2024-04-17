import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  
  // Encrypts the provided id using a simple encryption technique
  public enCrypt = (id : any) => {
    // Concatenate the id with random strings and encode it using base64 encoding
    const enc = window.btoa(`${this.makeid(5)}^${id}^${this.makeid(5)}`);
    return enc; // Return the encrypted string
  };

  // Decrypts the provided string to extract the original id
  public deCrypt = (str : any) => {
    // Decode the base64 encoded string
    const dec = window.atob(str);
    // Split the decoded string to extract the original id
    const data = dec.split("^");
    return data[1]; // Return the extracted id
  };

  // Generates a random string of specified length
  private makeid(length : any) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    // Iterate to generate each character of the random string
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result; // Return the generated random string
  }
}