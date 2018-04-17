
class Modal {
    constructor(projectsData) {
        this.$modal = document.querySelector('article.modal');
        this.$heading = this.$modal.querySelector('h1');
        this.$content = this.$modal.querySelector('.description');
        this.$image = this.$modal.querySelector('img');
        this.$close = this.$modal.querySelector('.close');
        this.$togglers = document.querySelectorAll('[data-modal]');
        //
        this.projects = projectsData;
        //
        this.initModalEvents();
    }

    toggleModal() {
        document.body.classList.toggle('open');
    }

    isModalOpen() {
        return document.body.classList.contains('open');
    }

    loadContent(key) {
        if( this.projects[key] ) {
            this.$heading.textContent = this.projects[key].title;
            this.$image.src = this.projects[key].image_path;
            this.$content.innerHTML = this.formatBody(this.projects[key].description);
        } else {
            throw new Error("Project does not exists, check if key exists.");
        }
    }

    formatBody(text) {
        return text.split('\r').map( line => {
            return `<p>${line}</p>`;
        }).join('');
    }

    initModalEvents() {
        // Nodes that open the modal
        this.addProjectItemEvents();
        this.addCloseButtonEvent();
        this.addKeyboardEvent();
        this.addBodyClickToggleEvent();
    }

    addBodyClickToggleEvent() {
        document.body.addEventListener('click', e => {
            if(e.target.classList.contains('_close')) {
                this.toggleModal();
            }
        });
    }

    addProjectItemEvents() {
        this.$togglers.forEach(togglerNode => {
            togglerNode.addEventListener('click', e => {
                this.toggleModal();
                try {
                    const project = this.findParentByClass(e.target, 'project');
                    this.loadContent(project.dataset['modal']);
                }
                catch (e) {
                    console.error(e.message);
                }
            });
        });
    }

    addCloseButtonEvent() {
        this.$close.addEventListener('click', e => {
            this.toggleModal();
        });
    }

    addKeyboardEvent() {
        document.addEventListener('keyup', e => {
            if(e.key == 'Escape') {
                this.toggleModal();
            }
        });
    }

    findParentByClass(element, className) {
        if (!element.parentNode) {
            return false;
        }
        if (element.classList.contains(className)) {
            return element;
        }
        return element.parentNode && this.findParentByClass(element.parentNode, className);
    }
}
