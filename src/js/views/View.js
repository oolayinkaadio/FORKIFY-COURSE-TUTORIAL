import icons from 'url:../../img/icons.svg';

export default class view {
    _data;
/**
 * Render the received object to the DOM
 * @param {Object | Object[] } data The data to be rendered (e.g recipe)
 * @param {boolean} [render = true] if false, create markup string instead of rendering to the DOM
 * returns {undefined | string}  A markup is returned if render is false
 * @this {Object} View instance
 * @author Olaosebikan Olayinka
 * @todo Finish the implementation
 */

    render(data, render = true) {
        if(!data ||(Array.isArray(data) && data.length === 0)) return this.renderError();
        
        this._data = data;
        const markup = this._generateMarkup();

        if(!render) return markup;

        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM = document.createRange().createContextualFragment(newMarkup);//creating a copy of the the HTML stored in the newMarkup variable, whereby the copied HTML element is stored in the DOM object virtual memory
        const newElements = Array.from(newDOM.querySelectorAll('*')); //Selecting all elements of the HTML document stored in the DOM virtual memory & converting it into an array
        const currentElements = Array.from(this._parentElement.querySelectorAll('*'))
        
        // Replacing the current DOM elements text and attributes that changes with the DOM elements in the virtual memory when we increase/decrease the servings 
        newElements.forEach((newEl, i) => {
            const currentElement = currentElements[i];
            // Update Text changes:
            if(!newEl.isEqualNode(currentElement) && newEl.firstChild?.nodeValue.trim() !== '') {
                currentElement.textContent = newEl.textContent;
            };
            // Update Attributes changes
            if(!newEl.isEqualNode(currentElement)){
                Array.from(newEl.attributes).forEach(attr => {
                    // Replacing all the attributes of the current element with the attributes of the new element
                    currentElement.setAttribute(attr.name, attr.value);
                })
            }
        })
    }

    _clear() {
        this._parentElement.innerHTML = '';
    }

    renderSpinner() {
        const markup = `
          <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
          `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
      }

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                <use href="${icons}#icon-alert-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
        `;
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }
}