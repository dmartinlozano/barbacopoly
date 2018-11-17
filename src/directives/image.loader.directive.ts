import {  Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[imageLoader]'
})
export class ImageLoader {

  constructor(private renderer: Renderer2, private el: ElementRef) {
      console.log("pasa por aqui 1");
      this.renderer.setAttribute(this.el.nativeElement, 'src',  "/assets/loading.gif");
    }

  @HostListener('load') onLoad() {
    console.log("pasa por aqui 2");
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.el.nativeElement.src);
  }
  @HostListener('error') onError() {
    console.log("pasa por aqui 3");
    this.renderer.setAttribute(this.el.nativeElement, 'src', "/assets/error.gif");
  }

}
