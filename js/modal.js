
class Modal {
    constructor( projectsData ) {
        this.$modal = document.querySelector('article.modal');
        this.$heading = this.$modal.querySelector('h1');
        this.$content = this.$modal.querySelector('.content');
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

    loadContent( key ) {
        if( this.projects[key] ) {
            this.$heading.textContent = this.projects[key].title;
        } else {
            throw new Error("Project does not exists, check if key exists.");
        }
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
            if( e.target.classList.contains('_close') ) {
                this.toggleModal();
            }
        });
    }

    addProjectItemEvents() {
        this.$togglers.forEach(togglerNode => {
            togglerNode.addEventListener('click', e => {
                // e.preventDefault();
                this.toggleModal();
                try {
                    this.loadContent(e.target.dataset['modal']);
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
            if( e.key == 'Escape' ) {
                this.toggleModal();
            }
        });
    }
}
