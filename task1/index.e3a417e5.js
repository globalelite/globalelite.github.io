$((s=>{const i=function(){const i=s(this),t=s("<div>").addClass("glitch-codrops-images").css({width:`${this.width}px`,height:`${this.height}px`}).insertBefore(this);for(let i=0;i<5;i+=1)s("<div>").addClass("glitch-codrops-image").css({backgroundImage:`url(${this.src})`,backgroundSize:`${this.width}px ${this.height}px`}).appendTo(t);i.remove()};s(".splash").css("display","block"),s(".splash img").each((function(){this.complete?i.call(this):s(this).on("load",i)}))}));