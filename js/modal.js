
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
        this.initEvents();
    }

    toggleModal() {
        document.body.classList.toggle('open');
    }

    loadContent( key ) {
        this.$heading.textContent = this.projects[key].title;
    }

    initEvents() {
        // Nodes that open the modal
        this.$togglers.forEach( togglerNode => {
            togglerNode.addEventListener('click', e => {
                e.preventDefault();
                this.toggleModal();
                this.loadContent( e.target.dataset['modal'] );
            });
        });

        // Modal close button
        this.$close.addEventListener('click', e => {
            this.toggleModal();
        });
    }
}
