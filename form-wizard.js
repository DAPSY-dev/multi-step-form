class FormWizard {
  constructor(formElement) {
    this.form = formElement
    this.classNames = {
      init: 'is-init-form-wizard',
      activeStep: 'is-active',
      activeControl: 'is-active',
    }
    this.elements = {
      steps: null,
      controls: {
        back: null,
        next: null,
        submit: null,
      },
      percentage: null,
    }
    this.activeStep = null
    this.totalSteps = null
    this.validStep = () => true
    this.handleClickBack = this.handleClickBack.bind(this)
    this.handleClickNext = this.handleClickNext.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.init()
  }

  isInitialized() {
    return this.form.classList.contains(this.classNames.init)
  }

  init() {
    if (this.isInitialized()) {
      console.error(`FormWizard is already initialized (id): ${this.form.dataset.id}`)
      return
    }
    this.elements.steps = [...this.form.querySelectorAll('.js-form-wizard-step')]
    this.elements.controls.back = this.form.querySelector('.js-form-wizard-back')
    this.elements.controls.next = this.form.querySelector('.js-form-wizard-next')
    this.elements.controls.submit = this.form.querySelector('.js-form-wizard-submit')
    this.elements.percentage = this.form.querySelector('.js-form-wizard-percentage')
    this.totalSteps = this.elements.steps.length
    this.setActiveStep(this.getActiveStep())
    this.addEvents()
    this.form.classList.add(this.initClassName)
  }

  getActiveStep() {
    const activeStep = this.form.dataset.activeStep
    return activeStep ? Number(activeStep) : 0
  }

  setActiveStep(step) {
    this.activeStep = step
    this.form.dataset.activeStep = this.activeStep
    for (const stepEl of this.elements.steps) {
      stepEl.classList.remove(this.classNames.activeStep)
    }
    this.elements.steps[this.activeStep].classList.add(this.classNames.activeStep)
    this.handleControls()
    this.handlePercentage()
  }

  handleControls() {
    if (this.activeStep === 0) {
      this.elements.controls.back.classList.remove(this.classNames.activeControl)
      this.elements.controls.next.classList.add(this.classNames.activeControl)
      this.elements.controls.submit.classList.remove(this.classNames.activeControl)
    }
    if (this.activeStep > 0 && this.activeStep < this.elements.steps.length - 1) {
      this.elements.controls.back.classList.add(this.classNames.activeControl)
      this.elements.controls.next.classList.add(this.classNames.activeControl)
      this.elements.controls.submit.classList.remove(this.classNames.activeControl)
    }
    if (this.activeStep >= this.elements.steps.length - 1) {
      this.elements.controls.back.classList.add(this.classNames.activeControl)
      this.elements.controls.next.classList.remove(this.classNames.activeControl)
      this.elements.controls.submit.classList.add(this.classNames.activeControl)
    }
  }

  handlePercentage() {
    this.elements.percentage.innerHTML = `${this.activeStep + 1}/${this.totalSteps}`
  }

  handleClickBack() {
    this.setActiveStep(this.activeStep - 1)
  }

  handleClickNext() {
    const activeStep = this.activeStep
    const stepHTML = this.elements.steps[activeStep]
    if (!this.validStep(stepHTML)) {
      return
    }
    this.setActiveStep(activeStep + 1)
  }

  handleSubmit(event) {
    const stepHTML = this.elements.steps[this.activeStep]
    if (!this.validStep(stepHTML)) {
      event.preventDefault()
    }
  }

  addEvents() {
    this.elements.controls.back.addEventListener('click', this.handleClickBack)
    this.elements.controls.next.addEventListener('click', this.handleClickNext)
    this.form.addEventListener('submit', this.handleSubmit)
  }

  removeEvents() {
    this.elements.controls.back.removeEventListener('click', this.handleClickBack)
    this.elements.controls.next.removeEventListener('click', this.handleClickNext)
    this.form.removeEventListener('submit', this.handleSubmit)
  }

  destroy() {
    if (!this.isInitialized()) {
      console.error(`FormWizard is not initialized (id): ${this.form.dataset.id}`)
      return
    }
    this.removeEvents()
    this.elements.steps = null
    this.elements.controls.back = null
    this.elements.controls.next = null
    this.elements.controls.submit = null
    this.elements.percentage = null
    this.activeStep = null
    this.totalSteps = null
    this.form.classList.remove(this.initClassName)
  }
}
