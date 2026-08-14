"use client";

import type { BuyerListingDemo } from "./types";
import {
  AccordionList,
  Checklist,
  InfoCard,
  KeyValueList,
  Section,
  SpecGrid,
  Timeline,
} from "./primitives";

type Content = Record<string, unknown>;

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export function StockSections({ listing }: { listing: BuyerListingDemo }) {
  const content = listing.content as Content;
  const features = asArray<string>(content.features);
  const condition = (content.condition || {}) as Record<string, string>;
  const ownership = asArray<{ id: string; title: string; date?: string; detail?: string }>(
    content.ownership
  );
  const service = asArray<{ id: string; title: string; date?: string; detail?: string }>(
    content.service
  );
  const specifications = asArray<{ label: string; value: string }>(content.specifications);

  return (
    <>
      <Section title="Vehicle Overview">
        <p className="text-[14px] leading-relaxed text-[#636366]">{listing.overview}</p>
      </Section>

      <Section title="Specifications">
        <SpecGrid items={[...listing.quickSpecs, ...specifications]} />
      </Section>

      <Section title="Features & Options">
        <div className="flex flex-wrap gap-2">
          {features.map((feature) => (
            <span
              key={feature}
              className="rounded-full border border-[#e5e5ea] bg-[#fafafa] px-3 py-1.5 text-[12px] font-medium text-[#1c1c1e]"
            >
              {feature}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Vehicle Condition">
        <KeyValueList
          items={[
            { label: "Overall", value: condition.overall || "—" },
            { label: "Accident history", value: condition.accident || "—" },
            { label: "Title", value: condition.title || "—" },
          ]}
        />
        {condition.notes ? (
          <p className="mt-3 text-[13px] leading-relaxed text-[#636366]">{condition.notes}</p>
        ) : null}
      </Section>

      <Section title="Ownership History">
        <Timeline items={ownership} />
      </Section>

      <Section title="Service History">
        <Timeline items={service} />
      </Section>

      {listing.story ? (
        <Section title="Owner Notes">
          <InfoCard>
            <p className="text-[13px] leading-relaxed text-[#636366]">{listing.story}</p>
          </InfoCard>
        </Section>
      ) : null}
    </>
  );
}

export function ModifiedSections({ listing }: { listing: BuyerListingDemo }) {
  const content = listing.content as Content;
  const currentSpecs = asArray<{ label: string; value: string }>(content.currentSpecs);
  const categories = asArray<{
    id: string;
    title: string;
    summary?: string;
    entries?: {
      id: string;
      title: string;
      detail?: string;
      meta?: string;
      photos?: { id: string; url: string; alt: string }[];
    }[];
  }>(content.categories);
  const dyno = asArray<{ label: string; value: string }>(content.dyno);

  return (
    <>
      <Section title="Build Summary">
        <p className="text-[14px] leading-relaxed text-[#636366]">
          {asString(content.buildSummary, listing.overview)}
        </p>
      </Section>

      <Section title="Current Specifications">
        <SpecGrid items={currentSpecs.length ? currentSpecs : listing.quickSpecs} />
      </Section>

      <Section
        title="Modification Categories"
        description="Expand each category to review installed parts and supporting notes."
      >
        <AccordionList items={categories} />
      </Section>

      <Section title="Dyno Information">
        <KeyValueList items={dyno} />
      </Section>

      <Section title="Builder Information">
        <InfoCard>
          <p className="text-[13px] font-semibold text-[#1c1c1e]">{asString(content.builder, "—")}</p>
          <p className="mt-1 text-[12px] text-[#636366]">Primary shop / builder</p>
        </InfoCard>
      </Section>

      {listing.story ? (
        <Section title="Owner Notes">
          <InfoCard>
            <p className="text-[13px] leading-relaxed text-[#636366]">{listing.story}</p>
          </InfoCard>
        </Section>
      ) : null}
    </>
  );
}

export function ClassicSections({ listing }: { listing: BuyerListingDemo }) {
  const content = listing.content as Content;
  const production = asArray<{ label: string; value: string }>(content.production);
  const factorySpecs = asArray<{ label: string; value: string }>(content.factorySpecs);
  const originality = asArray<{ label: string; value: string }>(content.originality);
  const matching = asArray<string>(content.matchingNumbers);
  const ownership = asArray<{ id: string; title: string; date?: string; detail?: string }>(
    content.ownershipTimeline
  );
  const awards = asArray<string>(content.awards);

  return (
    <>
      <Section title="Vehicle Summary">
        <p className="text-[14px] leading-relaxed text-[#636366]">{listing.overview}</p>
      </Section>

      <Section title="Vehicle Story">
        <InfoCard>
          <p className="text-[13px] leading-relaxed text-[#636366]">{listing.story}</p>
        </InfoCard>
      </Section>

      <Section title="Heritage Information">
        <InfoCard>
          <p className="text-[13px] leading-relaxed text-[#636366]">
            {asString(content.heritage)}
          </p>
        </InfoCard>
      </Section>

      <Section title="Production Details">
        <SpecGrid items={production} />
      </Section>

      <Section title="Factory Specifications">
        <KeyValueList items={factorySpecs} />
      </Section>

      <Section title="Originality Summary">
        <KeyValueList items={originality} />
      </Section>

      <Section title="Restoration Summary">
        <InfoCard>
          <p className="text-[13px] leading-relaxed text-[#636366]">
            {asString(content.restorationSummary)}
          </p>
        </InfoCard>
      </Section>

      <Section title="Matching Numbers">
        <div className="flex flex-wrap gap-2">
          {matching.map((item) => (
            <span
              key={item}
              className="rounded-full border border-[#cfd2f0] bg-[#f4f5fc] px-3 py-1.5 text-[12px] font-semibold text-[#1b1464]"
            >
              {item}
            </span>
          ))}
        </div>
      </Section>

      <Section title="Ownership Timeline">
        <Timeline items={ownership} />
      </Section>

      <Section title="Awards & Documentation">
        <ul className="space-y-2">
          {awards.map((award) => (
            <li
              key={award}
              className="rounded-lg border border-[#e5e5ea] bg-[#fafafa] px-3 py-2.5 text-[13px] font-medium text-[#1c1c1e]"
            >
              {award}
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}

export function RestoredSections({ listing }: { listing: BuyerListingDemo }) {
  const content = listing.content as Content;
  const profile = asArray<{ label: string; value: string }>(content.restorationProfile);
  const matching = asArray<{ label: string; value: string }>(content.matchingNumbers);
  const authenticity = asArray<{ label: string; value: string }>(content.authenticity);
  const timeline = asArray<{ id: string; title: string; date?: string; detail?: string }>(
    content.timeline
  );
  const categories = asArray<{
    id: string;
    title: string;
    summary?: string;
    entries?: {
      id: string;
      title: string;
      detail?: string;
      meta?: string;
      photos?: { id: string; url: string; alt: string }[];
    }[];
  }>(content.categories);

  return (
    <>
      <Section title="Vehicle Overview">
        <p className="text-[14px] leading-relaxed text-[#636366]">{listing.overview}</p>
        <div className="mt-3">
          <SpecGrid
            items={[
              { label: "Build Type", value: asString(content.buildType) },
              { label: "Mileage Status", value: asString(content.mileageStatus) },
            ]}
          />
        </div>
      </Section>

      <Section title="Restoration Profile">
        <KeyValueList items={profile} />
      </Section>

      <Section title="Seller-reported originality">
        <KeyValueList items={matching} />
      </Section>

      <Section title="Authenticity">
        <KeyValueList items={authenticity} />
      </Section>

      <Section
        title="Restoration Specifications"
        description="Expand each category to review restoration entries and process photos."
      >
        <AccordionList items={categories} />
      </Section>

      <Section title="Builder Information">
        <InfoCard>
          <p className="text-[13px] font-semibold text-[#1c1c1e]">{asString(content.builder)}</p>
          <p className="mt-1 text-[12px] text-[#636366]">Lead restoration builder</p>
        </InfoCard>
      </Section>

      <Section title="Shop Information">
        <InfoCard>
          <p className="text-[13px] font-semibold text-[#1c1c1e]">{asString(content.shop)}</p>
          <p className="mt-1 text-[12px] text-[#636366]">Primary restoration shop</p>
        </InfoCard>
      </Section>

      <Section title="Restoration Timeline">
        <Timeline items={timeline} />
      </Section>

      <Section title="Vehicle Story">
        <InfoCard>
          <p className="text-[13px] leading-relaxed text-[#636366]">{listing.story}</p>
        </InfoCard>
      </Section>
    </>
  );
}

export function RaceSections({ listing }: { listing: BuyerListingDemo }) {
  const content = listing.content as Content;
  const raceHistory = asArray<{ label: string; value: string }>(content.raceHistory);
  const timeline = asArray<{ id: string; title: string; date?: string; detail?: string }>(
    content.timeline
  );
  const profile = asArray<{ label: string; value: string }>(content.competitionProfile);
  const organizedCompetition =
    typeof content.organizedCompetition === "string" ? content.organizedCompetition : "";
  const competitionHistory =
    typeof content.competitionHistory === "string" ? content.competitionHistory : "";
  const documentationTypes = asArray<string>(content.documentationTypes);
  const documentationOther =
    typeof content.documentationOther === "string" ? content.documentationOther : "";
  const sparesIncluded = typeof content.sparesIncluded === "string" ? content.sparesIncluded : "";
  const sparesDescription =
    typeof content.sparesDescription === "string" ? content.sparesDescription : "";
  const knownRaceTrackIssues =
    typeof content.knownRaceTrackIssues === "string" ? content.knownRaceTrackIssues : "";
  const raceBuild = (content.raceBuild || {}) as Record<string, string>;
  const biography = (content.biography || {}) as Record<string, string>;
  const safety = asArray<{ label: string; value: string }>(content.safetyChecklist);
  const safetyDates = asArray<{ label: string; value: string }>(content.safetyDates);
  const safetyNotes = typeof content.safetyNotes === "string" ? content.safetyNotes : "";
  const modifications = asArray<{
    id: string;
    title: string;
    summary?: string;
    entries?: {
      id: string;
      title: string;
      detail?: string;
      meta?: string;
    }[];
  }>(content.modifications);
  const team = (content.team || {}) as Record<string, string>;

  return (
    <>
      <Section title="Overview">
        <p className="text-[14px] leading-relaxed text-[#636366]">{listing.overview}</p>
        <div className="mt-3">
          <SpecGrid items={listing.quickSpecs} />
        </div>
      </Section>

      {raceHistory.length > 0 ? (
        <Section title="Race History">
          <SpecGrid items={raceHistory} />
        </Section>
      ) : null}

      {timeline.length > 0 ? (
        <Section title="Race Timeline">
          <Timeline items={timeline} />
        </Section>
      ) : null}

      <Section title="Primary Use">
        <KeyValueList items={profile} />
      </Section>

      {(organizedCompetition || competitionHistory) && (
        <Section title="Competition History">
          {organizedCompetition ? (
            <KeyValueList
              items={[{ label: "Competed in organized competition", value: organizedCompetition }]}
            />
          ) : null}
          {competitionHistory ? (
            <div className={organizedCompetition ? "mt-3" : undefined}>
              <InfoCard>
                <p className="text-[13px] leading-relaxed text-[#636366]">{competitionHistory}</p>
              </InfoCard>
            </div>
          ) : null}
        </Section>
      )}

      {(documentationTypes.length > 0 || documentationOther) && (
        <Section title="Race / Track Documentation">
          <KeyValueList
            items={[
              ...(documentationTypes.length
                ? [{ label: "Documentation", value: documentationTypes.join(", ") }]
                : []),
              ...(documentationOther ? [{ label: "Other", value: documentationOther }] : []),
            ]}
          />
        </Section>
      )}

      {(sparesIncluded || sparesDescription) && (
        <Section title="Spares & Support Equipment">
          <KeyValueList
            items={[
              ...(sparesIncluded
                ? [{ label: "Included with the sale", value: sparesIncluded }]
                : []),
            ]}
          />
          {sparesDescription ? (
            <div className={sparesIncluded ? "mt-3" : undefined}>
              <InfoCard>
                <p className="text-[13px] leading-relaxed text-[#636366]">{sparesDescription}</p>
              </InfoCard>
            </div>
          ) : null}
        </Section>
      )}

      {knownRaceTrackIssues ? (
        <Section title="Known Race / Track Issues">
          <InfoCard>
            <p className="text-[13px] leading-relaxed text-[#636366]">{knownRaceTrackIssues}</p>
          </InfoCard>
        </Section>
      ) : null}

      {(raceBuild.narrative || raceBuild.workPerformedBy || raceBuild.shopBuilder) && (
        <Section title="Race / Track Build">
          {raceBuild.narrative ? (
            <InfoCard>
              <p className="text-[13px] leading-relaxed text-[#636366]">{raceBuild.narrative}</p>
            </InfoCard>
          ) : null}
          {(raceBuild.workPerformedBy || raceBuild.shopBuilder) && (
            <div className="mt-3">
              <KeyValueList
                items={[
                  ...(raceBuild.workPerformedBy
                    ? [{ label: "Prepared by", value: raceBuild.workPerformedBy }]
                    : []),
                  ...(raceBuild.shopBuilder
                    ? [{ label: "Shop / Builder", value: raceBuild.shopBuilder }]
                    : []),
                ]}
              />
            </div>
          )}
        </Section>
      )}

      {(biography.vehicleHistory ||
        (biography.preparationNotes && biography.preparationNotes !== raceBuild.narrative)) && (
        <Section title="Vehicle Biography">
          <div className="space-y-3">
            {biography.vehicleHistory ? (
              <InfoCard title="Vehicle History">
                <p className="text-[13px] leading-relaxed text-[#636366]">
                  {biography.vehicleHistory}
                </p>
              </InfoCard>
            ) : null}
            {biography.preparationNotes && biography.preparationNotes !== raceBuild.narrative ? (
              <InfoCard title="Preparation Notes">
                <p className="text-[13px] leading-relaxed text-[#636366]">
                  {biography.preparationNotes}
                </p>
              </InfoCard>
            ) : null}
          </div>
        </Section>
      )}

      {(safety.length > 0 || safetyDates.length > 0 || safetyNotes) && (
        <Section title="Safety Equipment">
          {safety.length > 0 ? <Checklist items={safety} /> : null}
          {safetyDates.length > 0 ? (
            <div className="mt-3">
              <KeyValueList items={safetyDates} />
            </div>
          ) : null}
          {safetyNotes ? (
            <div className="mt-3">
              <InfoCard>
                <p className="text-[13px] leading-relaxed text-[#636366]">{safetyNotes}</p>
              </InfoCard>
            </div>
          ) : null}
        </Section>
      )}

      {modifications.length > 0 ? (
        <Section title="Race Modifications">
          <AccordionList items={modifications} />
        </Section>
      ) : null}

      <Section title="Race Team & Builder">
        <KeyValueList
          items={[
            { label: "Race Team", value: team.raceTeam || "—" },
            { label: "Builder", value: team.builder || "—" },
            { label: "Dealer", value: team.dealer || "—" },
          ]}
        />
      </Section>
    </>
  );
}
