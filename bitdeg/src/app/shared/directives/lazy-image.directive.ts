import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  OnInit,
} from "@angular/core";
import { generateRandomColor as randomColor } from "@core/utils";

@Directive({
  selector: "[bitdegLazyImage]",
})
export class LazyImageDirective implements OnInit {
  @HostBinding("src") imageUrl: string;
  @Input() bitdegLazyImage: string = "";
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    this.isImageInView() && this.loadImage();
  }

  @HostListener("window:scroll", ["$event"]) lazyLoadImage(): void {
    if (this.imageUrl && this.imageUrl.length > 0) return;
    this.isImageInView() && this.loadImage();
  }

  private isImageInView = (): boolean => {
    const rect = this.el.nativeElement.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  private loadImage = (): void => {
    const img = new Image(150, 150);
    img.src = this.replaceHex(this.bitdegLazyImage);
    img.onload = () => {
      this.imageUrl = img.src;
    };
    img.onerror = () => {
      this.imageUrl = this.imageUrl;
    };
  };

  private replaceHex = (url: string): string => {
    return url.replace(url.substr(url.lastIndexOf("/")), `/${randomColor()}`);
  };
}
