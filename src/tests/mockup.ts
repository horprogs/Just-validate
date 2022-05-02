export const mockup = `
<form action='#' class='row g-3' id='form' autocomplete='off'>
      <div class='row'>
        <div class='col-md-6' id="name-group">
          <label for='name'>Enter your name</label>
          <input
            type='text'
            class='form__input form-control'
            placeholder='Enter your name'
            autocomplete='off'
            name='name'
            id='name'
          />
        </div>
        <div class='col-md-6'>
          <label for='email'>Enter your email</label>
          <input
            type='email'
            class='form__input form-control'
            placeholder='Enter your email'
            autocomplete='off'
            name='email'
            id='email'
          />
        </div>
      </div>
      <div class='form-group'>
        <label for='password'>Enter your password</label>
        <input
          type='password'
          class='form__input form-control'
          placeholder='Enter your password'
          autocomplete='off'
          name='password'
          id='password'
        />
      </div>
      <div class='form-group'>
        <label for='password'>Repeat your password</label>
        <input
          type='password'
          class='form__input form-control'
          placeholder='Repeat your password'
          autocomplete='off'
          name='repeat-password'
          id='repeat-password'
        />
      </div>
      <div class='form-group'>
        <label for='password'>Enter your message</label>
        <textarea
          name='msg'
          cols='30'
          rows='10'
          class='form__textarea form-control'
          id='message'
        ></textarea>
      </div>
      <div class='form-group'>
        <input
          type='checkbox'
          id='consent_checkbox'
          class='form__checkbox'
        /><label for='consent_checkbox'>I agree</label>
      </div>
      <div class='form-group' id='read_terms_checkbox_group' style='width: 250px'>
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_1'
            class='form__checkbox'
          />I have read Privacy Policy</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_2'
            class='form__checkbox'
          />I have read Terms Of Use</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_3'
            class='form__checkbox'
          />I have read Cookies Policy</label
        >
      </div>
      <div class='row'>
        <div class='col-2'>
          <div class='form-check' id='communication_radio_group'>
            <input
              type='radio'
              name='radio'
              class='form-check-input'
              id='communication_radio_group_1'
            />
            <label class='form-check-label' for='communication_radio_group_1'>
              Email
            </label>
            <br />
            <input
              type='radio'
              name='radio'
              class='form-check-input'
              id='communication_radio_group_2'
            />
            <label class='form-check-label' for='communication_radio_group_2'>
              SMS
            </label>
          </div>
        </div>
      </div>

      <div class='form-group'>
        <label for='favorite_animal_select' class='form-label'>Select you favorite animal</label>
        <select name='pets' id='favorite_animal_select' class='form-select'>
          <option value=''>--Please choose an option--</option>
          <option value='dog'>Dog</option>
          <option value='cat'>Cat</option>
          <option value='hamster'>Hamster</option>
          <option value='parrot'>Parrot</option>
          <option value='spider'>Spider</option>
          <option value='goldfish'>Goldfish</option>
        </select>
      </div>
      
      <div class="row">
        <div class="col">
          <label for="files">Upload your files</label>
          <input
            type="file"
            class="form__input form-control"
            placeholder="Upload your files"
            autocomplete="off"
            name="files"
            id="files"
            multiple
          />
        </div>
      </div>
             <div class="errors-container"></div>
      <button class='btn btn-primary' id="submit-btn">Submit</button>
      <button class='btn btn-primary' id="custom-btn">Custom</button>
`;

export const multipleFormsMockup = `
<form action='#' class='row g-3' autocomplete='off' id='form1'>
      <div class='row'>
        <div class='col-md-6'>
          <label for='name'>Enter your name</label>
          <input
            type='text'
            class='form__input form-control name'
            placeholder='Enter your name'
            autocomplete='off'
            name='form1_name'
          />
        </div>
      </div>
      <div class='form-group read_terms_checkbox_group' style='width: 250px'>
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form1_read_terms_checkbox_group_1'
          />I have read Privacy Policy</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form1_read_terms_checkbox_group_2'
          />I have read Terms Of Use</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form1_read_terms_checkbox_group_3'
          />I have read Cookies Policy</label
        >
      </div>

      <button class='btn btn-primary' id="form1_submit-btn">Submit</button>
</form>
<form action='#' class='row g-3 form' id='form2' autocomplete='off'>
      <div class='row'>
        <div class='col-md-6'>
          <label for='name'>Enter your name</label>
          <input
            type='text'
            class='form__input form-control name'
            placeholder='Enter your name'
            autocomplete='off'
            name='form2_name'
          />
        </div>
      </div>
      <div class='form-group read_terms_checkbox_group' style='width: 250px'>
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form2_read_terms_checkbox_group_1'
          />I have read Privacy Policy</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form2_read_terms_checkbox_group_2'
          />I have read Terms Of Use</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            class='form__checkbox'
            id='form2_read_terms_checkbox_group_3'
          />I have read Cookies Policy</label
        >
      </div>
      <button class='btn btn-primary' id="form2_submit-btn">Submit</button>
</form>
`;
