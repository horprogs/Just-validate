import { clickByText } from '../testingUtils';

describe('Validation', () => {
  test('should validate', async () => {
    document.body.innerHTML = `
<!DOCTYPE html>
<body>
<form id="form" action="#">
    <input type="text" id="name">
    <input type="email" id="email">                 
    <input type="password" id="password">
    
   <fieldset id="checkbox-group">      
        <legend>What is Your Favorite Pet?</legend>      
        <input type="checkbox" name="favorite_pet" value="Cats">Cats<br>      
        <input type="checkbox" name="favorite_pet" value="Dogs">Dogs<br>      
        <input type="checkbox" name="favorite_pet" value="Birds">Birds<br>      
    </fieldset>  
   
   <input type="checkbox" name="checkbox_1" value="Required checkbox">Required checkbox<br>      
   <input type="checkbox" name="checkbox_2" value="Non-required checkbox">Non-required checkbox<br>   
         
   <fieldset id="radio-group1">
    <input type="radio" value="value1" name="radio-group1">
    <input type="radio" value="value2" name="radio-group1">
  </fieldset>

  <fieldset id="radio-group2">
    <input type="radio" value="value1" name="radio-group2">
    <input type="radio" value="value2" name="radio-group2">
    <input type="radio" value="value3" name="radio-group2">
  </fieldset>
  
  <button type="submit">Send</button>
</form>
</body>
</html>`;

    clickByText('Send');
  });
});
