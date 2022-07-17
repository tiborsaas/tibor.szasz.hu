import styled from "@emotion/styled";
import mediaqueries from "@styles/media";

const Blockquote = styled.blockquote`
	transition: ${p => p.theme.colorModeTransition};
	margin: 15px auto 50px;
	color: ${p => p.theme.colors.articleText};
	font-family: ${p => p.theme.fonts.serif};
	font-style: italic;
	background: var(--theme-ui-colors-track);
    padding-left: 36px;
	position: relative;

	&:before {
		content: '“';
		position: absolute;
		left: -0.15em;
		top: -0.15em;
		font-size: 3.5em;
		color: rgba(0, 0, 0, 0.5);
	}

	${mediaqueries.tablet`
    	margin: 10px auto 35px;
		padding-left: 46px;
		&:before {
			left: 0.15em;
		}
	`};


	${mediaqueries.phablet`
		padding-left: 55px;
		&:before {
			left: 0.25em;
		}
	`};

	& > p {
		font-family: ${p => p.theme.fonts.serif};
		max-width: 880px !important;
		padding-right: 100px;
		padding-bottom: 0;
		width: 100%;
		margin: 0 auto;
		color: inherit !important;
		font-size: 36px;
		line-height: 1.32;
		font-weight: bold;

		${mediaqueries.tablet`
			font-size: 26px;
			padding: 0 36px 0 0;
		`};

		${mediaqueries.phablet`
			font-size: 26px;
			padding: 0 20px 0 0px;
		`};

		em {
			color: ${p => p.theme.colors.accent};
		}
	}
`;

export default Blockquote;
