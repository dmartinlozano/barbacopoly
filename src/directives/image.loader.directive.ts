import {  Directive, Renderer2, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[imageLoader]'
})
export class ImageLoader {

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.renderer.setAttribute(this.el.nativeElement, 'src',  "/assets/loading.gif");
  }

  @HostListener('load') onLoad() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', this.el.nativeElement.src);
  }
  @HostListener('error') onError() {
    this.renderer.setAttribute(this.el.nativeElement, 'src', "/assets/error.gif");
  }

}
