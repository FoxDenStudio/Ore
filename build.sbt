name := "ore"
version := "1.5.21"

lazy val `ore` = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.12.4"
routesGenerator := InjectedRoutesGenerator
resolvers ++= Seq(
  "sponge" at "https://repo.spongepowered.org/maven",
  "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases",
  "Akka Snapshot Repository" at "http://repo.akka.io/snapshots/"
)

libraryDependencies ++= Seq( ehcache , ws , specs2 % Test , guice )
libraryDependencies ++= Seq(
  "org.spongepowered"     %   "play-discourse"          %   "2.0.0-SNAPSHOT",
  "org.spongepowered"     %   "plugin-meta"             %   "0.4.1",
  "com.typesafe.play"     %%  "play-slick"              %   "3.0.3",
  "com.typesafe.play"     %%  "play-slick-evolutions"   %   "3.0.3",
  "org.postgresql"        %   "postgresql"              %   "42.2.1",
  "com.github.tminglei"   %%  "slick-pg"                %   "0.16.0",
  "io.sentry"             %   "sentry-logback"          %   "1.7.0",
  "org.bouncycastle"      %   "bcprov-jdk15on"          %   "1.59",
  "org.bouncycastle"      %   "bcpkix-jdk15on"          %   "1.59",
  "org.bouncycastle"      %   "bcpg-jdk15on"            %   "1.59",
  "javax.mail"            %   "mail"                    %   "1.4.7",

  "com.vladsch.flexmark"  % "flexmark"                       %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-autolink"          %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-anchorlink"        %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-gfm-strikethrough" %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-gfm-tasklist"      %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-tables"            %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-typographic"       %  "0.32.14",
  "com.vladsch.flexmark"  % "flexmark-ext-wikilink"          %  "0.32.14",

  "org.webjars"       % "font-awesome" % "5.0.6",
  "org.webjars.npm"   % "filesize"     % "3.6.1",
  "org.webjars.npm"   % "jquery"       % "3.3.1",
  "org.webjars.npm"   % "moment"       % "2.22.0",
  "org.webjars.npm"   % "bootstrap"    % "4.0.0"
)

unmanagedResourceDirectories in Test +=  (baseDirectory.value / "target/web/public/test")
